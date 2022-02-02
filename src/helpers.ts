import { 
    vaultAddress, 
    externalAddress, 
    Auction,
    getVaultAbi,
    VaultAddressMap,
    AuctionList,
    getUnderlyingDecimals,
    getBiddingToken,
    getOptionType,
    getStrikeSelectionAbi,
    StrikeSelectionAddressMap
} from "./constants"
import RibbonThetaVaultABI from "./abi/RibbonThetaVault.json"
import RibbonThetaVaultSTETHABI from "./abi/RibbonThetaVaultSTETH.json"
import oTokenFactoryABI from "./abi/oTokenFactory.json"
import GnosisEasyAuctionABI from "./abi/GnosisEasyAuction.json"
import UniswapMulticallABI from "./abi/UniswapMulticall.json"
import stETHABI from "./abi/stETH.json"
import yvUSDCABI from "./abi/yvUSDC.json"
import Web3 from "web3"
import { ethers, BigNumber } from "ethers"
import moment from "moment-timezone";
import { AbiItem } from 'web3-utils'

require("dotenv").config()

const web3 = new Web3(process.env.RPC_URL)
const InputDataDecoder = require("ethereum-input-data-decoder")

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

export async function decodeCommitAndClose(hash: string, auction: Auction) {
    const tx = await web3.eth.getTransactionReceipt(hash);

    const oTokenCreationLog = tx.logs.filter(
        log => log.address == externalAddress.oTokenFactory
    )[0];

    const oTokenDetails = decodeLog(
        oTokenCreationLog, 
        oTokenFactoryABI, 
        "OtokenCreated"
    );
    
    let size = await _getSize(auction)
    const strikePrice = BigNumber.from(oTokenDetails.strikePrice)

    return {
        strikePrice: parseFloat(
            strikePrice.div(10**8).toString()
        ).toFixed(2),
        expiry: moment.unix(Number(oTokenDetails.expiry))
            .utc().format("Do MMMM YYYY [at] HA UTC"), 
        size: size,
        vault: auction,
        asset: getBiddingToken(auction),
        type: getOptionType(auction),
    }
}

export async function decodeRollToNextOption(hash: string, auction: Auction) {
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
        asset: getBiddingToken(auction),
        type: getOptionType(auction)
    }
}

export async function getStethPrice(formatted=true) {
    const stETH = new web3.eth.Contract(
        stETHABI as AbiItem[], 
        externalAddress.stETH
    )
    const numerator = ethers.utils.parseUnits('1', 18)
    const tokenPerstETH = await stETH.methods.tokensPerStEth().call()
    
    return formatted 
        ? parseFloat(
            ethers.utils.formatUnits(numerator.mul(numerator).div(tokenPerstETH), 18)
        ).toFixed(4)
        : numerator.mul(numerator).div(tokenPerstETH)
}

export async function getYvusdcPrice(formatted=true) {
    const yvUSDC = new web3.eth.Contract(
        yvUSDCABI as AbiItem[], 
        externalAddress.yvUSDC
    )
    const pricePerShare = await yvUSDC.methods.pricePerShare().call()
    
    return formatted 
        ? parseFloat(
            ethers.utils.formatUnits(pricePerShare, 6)
        ).toFixed(4)
        : pricePerShare
}

export async function getEstimatedSizes() {
    const promises = await Promise.all(AuctionList.map(async (auction) => {
        const size = await _getSize(auction)

        return {
            vaultName: auction,
            size: size
        };
    }))

    const sizes = {};

    promises.forEach(element => {
        sizes[element.vaultName] = element.size
    }) 
    return sizes;
}

async function _getSize(auction: Auction) {
    const abi = getVaultAbi(auction)

    const contract = new web3.eth.Contract(
        abi,
        VaultAddressMap[auction]
    )

    const total = await contract.methods.totalBalance().call();
    const state = await contract.methods.vaultState().call();
    const pps = await contract.methods.pricePerShare().call();
    const decimals = getUnderlyingDecimals(auction)
    const divider = ethers.utils.parseUnits('1', decimals)

    let size = BigNumber.from(total)
        .sub(BigNumber.from(state.queuedWithdrawShares).mul(pps).div(divider))
    
    if (auction == "eth-put") {
        const expiry = moment().add(1, "week").utc().day(5).hour(8).minute(0).second(0).unix()
        const yvUSDCPrice = await getYvusdcPrice(false)
        const strikePrice = await getStrike(auction, expiry, true)
        size = size.mul(10**6).div(yvUSDCPrice).mul(10**8).div(strikePrice.newStrikePrice)
    } else if (auction == "steth-call") {
        const steth = await getStethPrice(false);
        size = size.mul(divider).div(steth)
    }

    return parseFloat(
        ethers.utils.formatUnits(size, decimals)
    ).toFixed(2);
}

async function getStrike(auction: Auction, expiry: number, isPut: Boolean) {
    const abi = getStrikeSelectionAbi(auction) 

    const contract = new web3.eth.Contract(
        abi,
        StrikeSelectionAddressMap[auction]
    )

    const strike = await contract.methods.getStrikePrice(expiry, isPut).call();

    return strike
}

