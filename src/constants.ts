import RibbonThetaVaultABI from "./abi/RibbonThetaVault.json"
import RibbonThetaVaultSTETHABI from "./abi/RibbonThetaVaultSTETH.json"
import oTokenFactoryABI from "./abi/oTokenFactory.json"
import GnosisEasyAuctionABI from "./abi/GnosisEasyAuction.json"
import UniswapMulticallABI from "./abi/UniswapMulticall.json"
import ChainLinkOracleABI from "./abi/ChainLinkOracle.json"
import stETHABI from "./abi/stETH.json"
import yvUSDCABI from "./abi/yvUSDC.json"
import { AbiItem } from 'web3-utils'

export const AuctionList = [
    "wbtc-call",
    "aave-call",
    "steth-call",
    "eth-call",
    "eth-put",
] as const;

export type Auction = typeof AuctionList[number];

export const getOptionType = (auction: Auction) => {
    return auction.split("-").pop()
}

export const getVaultName = (auction: Auction) => {
    const [token, option] = auction.split("-")

    const tokenText = token.toUpperCase()
    const optionText = option[0].toUpperCase() + option.slice(1)

    return `${tokenText} (${optionText})`
}

export const getBiddingToken = (auction: Auction) => {
    switch (auction) {
        case "wbtc-call":
        case "aave-call":
        case "eth-call":
        case "eth-put":
            return auction.split("-")[0].toUpperCase()
        case "steth-call":
            return "wstETH"
    }
} 

export const getUnderlyingDecimals = (auction: Auction) => {
    switch (auction) {
        case "aave-call":
        case "eth-call":
        case "steth-call":
            return 18
        case "wbtc-call":
            return 8
        case "eth-put":
            return 6
    }
}

export const getVaultAbi = (auction: Auction) => {
    switch (auction) {
        case "wbtc-call":
        case "aave-call":
        case "eth-call":
        case "eth-put":
            return RibbonThetaVaultABI as AbiItem[]
        case "steth-call":
            return RibbonThetaVaultSTETHABI as AbiItem[]
    }
}

export const VaultAddressMap: { [auction in Auction]: string } = {
    "wbtc-call": "0x65a833afDc250D9d38f8CD9bC2B1E3132dB13B2F",
    "aave-call": "0xe63151A0Ed4e5fafdc951D877102cf0977Abd365",
    "steth-call": "0x53773E034d9784153471813dacAFF53dBBB78E8c",
    "eth-call": "0x25751853Eab4D0eB3652B5eB6ecB102A2789644B",
    "eth-put": "0xCc323557c71C0D1D20a1861Dc69c06C5f3cC9624",
}


export const vaultAddress = {
    "RibbonThetaVaultAAVECall": "0xe63151A0Ed4e5fafdc951D877102cf0977Abd365",
    "RibbonThetaVaultETHCall": "0x25751853Eab4D0eB3652B5eB6ecB102A2789644B",
    "RibbonThetaVaultSTETHCall": "0x53773E034d9784153471813dacAFF53dBBB78E8c",
    "RibbonThetaVaultWBTCCall": "0x65a833afDc250D9d38f8CD9bC2B1E3132dB13B2F",
    "RibbonThetaYearnVaultETHPut": "0xCc323557c71C0D1D20a1861Dc69c06C5f3cC9624",
}

export const vaultNames = {
    "RibbonThetaVaultAAVECall": "AAVE Call Vault",
    "RibbonThetaVaultETHCall": "ETH Call Vault",
    "RibbonThetaVaultSTETHCall": "wstETH Call Vault",
    "RibbonThetaVaultWBTCCall": "WBTC Call Vault",
    "RibbonThetaYearnVaultETHPut": "yvUSDC Call Vault",
}

export const vaultTypes = {
    "RibbonThetaVaultAAVECall": "call",
    "RibbonThetaVaultETHCall": "call",
    "RibbonThetaVaultSTETHCall": "call",
    "RibbonThetaVaultWBTCCall": "call",
    "RibbonThetaYearnVaultETHPut": "put",
}

export const vaultAssets = {
    "RibbonThetaVaultAAVECall": "AAVE",
    "RibbonThetaVaultETHCall": "ETH",
    "RibbonThetaVaultSTETHCall": "wstETH",
    "RibbonThetaVaultWBTCCall": "WBTC",
    "RibbonThetaYearnVaultETHPut": "ETH",
}

export const strikeAssets = Object.keys(vaultTypes).reduce(
    (o, key) => ({ ...o, [vaultAssets[key]+vaultTypes[key]]: undefined}), {}
)

export const getVaultDecimals = (vault) => {
    switch(vault) {
        case "RibbonThetaVaultAAVECall":
        case "RibbonThetaVaultETHCall":
        case "RibbonThetaVaultSTETHCall":
            return 18
        case "RibbonThetaVaultWBTCCall":
            return 8
        case "RibbonThetaYearnVaultETHPut":
            return 6
    }
}

export const externalAddress = {
    "oTokenFactory": "0x7C06792Af1632E77cb27a558Dc0885338F4Bdf8E",
    "gnosisEasyAuction": "0x0b7fFc1f4AD541A4Ed16b40D8c37f0929158D101",
    "yvUSDC": "0xa354f35829ae975e850e23e9615b11da1b3dc4de",//"0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9",
    "stETH": "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
    "UniswapMulticall": "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
    "ETHUSDChainlinkOracle": "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
}

export const mockAuctionSeries = [
    "0x4ac7b4eb806d273a1da3626b93a8c9d1fcd1f1b183b9976f0b3fa61d982302df", // RibbonThetaVaultWBTCCall commitAndClose
    "0x9ca60f365cd0b4e445ee114cf412bff37d2944fcbe7561c44448898afda8f28b", // RibbonThetaVaultAAVECall commitAndClose
    "0xcfa8cbc0233d7848707c2507ef5e4b31b2113a11fd849036a217f02ad5b9304e", // RibbonThetaVaultWBTCCall rollToNextOption
    "0xbabd05116482bcd177db9a496ec72e10d30886d7fbdc24ca3651c018eeffc033", // RibbonThetaVaultSTETHCall tryAggregate
    "0x22e9c05fbfaef2f95d7b4fdcdf81741b8a9c1937b66798344fda5316e9899fd8", // RibbonThetaVaultAAVECall rollToNextOption
    "0xb6648392351bae1769f5482a004444ecc2af8c14167c9d854017c0c298d2b16b", // RibbonThetaVaultETHCall tryAggregate
    "0x4a2d26c1bfa77a4794a9c748695c1e279b559fc2893256c4a44b0ed85ef99a4a", // RibbonThetaVaultSTETHCall rollToNextOption
    "0x616668bc440d45970c48e6cf50f23177386a78d05930049bc2e7f43518d46286", // RibbonThetaVaultETHCall commitAndClose
    "0xb43076475b54e228519555183e1cef7d4a19d2a4d371d794f84ac2ae9a886652", // RibbonThetaVaultETHCall rollToNextOption
    "0x6cca7ae07d5dfdf220294d43553ae106a2590a6342fad511a8eaaabffc041d28", // RibbonThetaYearnVaultETHPut tryAggregate
    "0x9f6376a1a609e742ba7c90d2e2d38bc3b61364ecaae130eb2f7286d5fd6834a6", // RibbonThetaYearnVaultETHPut commitAndClose
    "0xb0dacc365a5b2c8295de35d02a873d288c3abb224d63bacc3f0f7734ff26c1de", // RibbonThetaYearnVaultETHPut rollToNextOption
]

