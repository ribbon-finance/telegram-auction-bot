import { 
    vaultAddress, 
    vaultTypes, 
    vaultAssets, 
    externalAddress, 
    getVaultDecimals 
} from "./constants"
import RibbonThetaVaultABI from "./abi/RibbonThetaVault.json"
import RibbonThetaVaultSTETHABI from "./abi/RibbonThetaVaultSTETH.json"
import oTokenFactoryABI from "./abi/oTokenFactory.json"
import GnosisEasyAuctionABI from "./abi/GnosisEasyAuction.json"
import UniswapMulticallABI from "./abi/UniswapMulticall.json"
import ChainLinkOracleABI from "./abi/ChainLinkOracle.json"
import stETHABI from "./abi/stETH.json"
import yvUSDCABI from "./abi/yvUSDC.json"
import Web3 from "web3"
import { ethers, BigNumber } from "ethers"
import moment from "moment-timezone";
import { AbiItem } from 'web3-utils'

require("dotenv").config()

const web3 = new Web3(process.env.RPC_URL)
const InputDataDecoder = require("ethereum-input-data-decoder")

async function calculateyvPutSize(amount) {
    const yvUSDC = new web3.eth.Contract(
        yvUSDCABI as AbiItem[], 
        externalAddress.yvUSDC
    )
    const yvUSDCPrice = await yvUSDC.methods.pricePerShare().call()

    const oracle = new web3.eth.Contract(
        ChainLinkOracleABI as AbiItem[], 
        externalAddress.ETHUSDChainlinkOracle
    )
    const ethPrice = await oracle.methods.latestAnswer().call()
    return BigNumber.from(amount)
        .mul(yvUSDCPrice).div(10**6)
        .mul(10**8).div(ethPrice)
}

export async function decodeTransaction(hash) {
    const tx = await web3.eth.getTransaction(hash);

    if (tx) {
        const abi = tx.to == externalAddress.UniswapMulticall
            ? UniswapMulticallABI as AbiItem[]
            : tx.to == vaultAddress.RibbonThetaVaultSTETHCall
                ? RibbonThetaVaultSTETHABI as AbiItem[]
                : RibbonThetaVaultABI as AbiItem[];

        const decoder = new InputDataDecoder(abi);
        const data = decoder.decodeData(tx.input);

        return {
            to: tx.to == externalAddress.UniswapMulticall
                ? "0x" + data.inputs[1][0][0]
                : tx.to, 
            method: data.method
        }
    } else {
        return undefined;
    }
}

function decodeLog(log, abi, method) {
    const methodAbi = abi.filter(
        element => element.name == method
    )[0].inputs;

    return web3.eth.abi.decodeLog(
        methodAbi, 
        log.data, 
        log.topics.slice(1)
    );
}

export async function decodeCommitAndClose(hash, vault) {
    const tx = await web3.eth.getTransactionReceipt(hash);

    const oTokenCreationLog = tx.logs.filter(
        log => log.address == externalAddress.oTokenFactory
    )[0];

    const oTokenDetails = decodeLog(
        oTokenCreationLog, 
        oTokenFactoryABI, 
        "OtokenCreated"
    );

    const contract = new web3.eth.Contract(
        RibbonThetaVaultABI as AbiItem[], 
        vaultAddress[vault]
    )

    let size = await contract.methods.vaultState().call()

    if (vault == "RibbonThetaYearnVaultETHPut") {
        size.lockedAmount = await calculateyvPutSize(size.lockedAmount)
    } 

    const decimals = getVaultDecimals(vault)

    return {
        strikePrice: parseFloat(
            BigNumber.from(oTokenDetails.strikePrice).div(10**8).toString()
        ).toFixed(2),
        expiry: moment.unix(Number(oTokenDetails.expiry))
            .utc().format("Do MMMM YYYY [at] HA UTC"), 
        size: parseFloat(
            ethers.utils.formatUnits(size.lockedAmount, decimals)
        ).toFixed(2),
        vault: vault,
        asset: vaultAssets[vault],
        type: vaultTypes[vault],
    }
}

export async function decodeRollToNextOption(hash, vault) {
    const tx = await web3.eth.getTransactionReceipt(hash);
    const NewAuctionLog = tx.logs.filter(
        log => log.address == externalAddress.gnosisEasyAuction
    )[0]

    const NewAuctionDetails = decodeLog(
        NewAuctionLog, 
        GnosisEasyAuctionABI, 
        "NewAuction"
    );

    return {
        depositAmount: parseFloat(
            ethers.utils.formatUnits(
                BigNumber.from(NewAuctionDetails._auctionedSellAmount), 8)
        ).toFixed(2), 
        auctionId: NewAuctionDetails.auctionId,
        asset: vaultAssets[vault],
        type: vaultTypes[vault]
    }
}

export async function getStethPrice() {
    const stETH = new web3.eth.Contract(
        stETHABI as AbiItem[], 
        externalAddress.stETH
    )
    const numerator = ethers.utils.parseUnits('1', 18)
    const tokenPerstETH = await stETH.methods.tokensPerStEth().call()
    
    return parseFloat(
        ethers.utils.formatUnits(numerator.mul(numerator).div(tokenPerstETH), 18)
    ).toFixed(4)
}

export async function getEstimatedSizes() {
    const promises = await Promise.all(Object.keys(vaultAddress).map(async (vault) => {
        const abi = vault != "RibbonThetaVaultSTETHCall"
            ? RibbonThetaVaultABI
            : RibbonThetaVaultSTETHABI;

        const contract = new web3.eth.Contract(
            abi as AbiItem[], 
            vaultAddress[vault]
        )
        const total = await contract.methods.totalBalance().call();
        const state = await contract.methods.vaultState().call();
        const pps = await contract.methods.pricePerShare().call();
        const decimals = getVaultDecimals(vault)
        const divider = ethers.utils.parseUnits('1', decimals)

        let size = state.queuedWithdrawShares != "0"
            ? BigNumber.from(total)
                .sub(BigNumber.from(state.queuedWithdrawShares).mul(pps).div(divider))
            : BigNumber.from(total)

        if (vault == "RibbonThetaYearnVaultETHPut") {
            size = await calculateyvPutSize(size)
        }

        return {
            vaultName: vault,
            size: parseFloat(
                ethers.utils.formatUnits(size, decimals)
            ).toFixed(2)
        };
    }))

    const sizes = {};

    promises.forEach(element => {
        sizes[element.vaultName] = element.size
    }) 

    return sizes;
}

export function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}