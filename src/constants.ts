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
    "yvUSDC": "0xa354f35829ae975e850e23e9615b11da1b3dc4de",
    "stETH": "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
    "UniswapMulticall": "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
    "ETHUSDChainlinkOracle": "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
}

export const mockAuctionSeries = [
    "0xed43121d795c49ba0bcc9db1e0918b7c1bbfaf3c07b2c513bcf8d171b6c86703", // WBTC commit and close
    "0xeb8dc049f3e0306fe93beea479723a967e3b0cb81d65f953b9fa30db9823f41d", // WBTC roll to next options
    "0x7cfb8cdc139c9cef284dca44c8ef7335dced75d0f561498bb18330ca192b8a6f", // AAVE commit and close
    "0xf3a2bb79c5ee14027d137b2410c8d1c5592d22f843b0618a7660cdadec93b928", // AAVE roll to next options
    "0xb9d854988646e7e88ecb15ab1c501741fcc6a3173e6060800398bbdfc9056c2f", // STETH commit and close
    "0x6fc08319b9df2815dc4bcc14ce5e099b1948fda8639574515d4e365a1f4ec3e8", // STETH roll to next options
    "0xdafedcf01e1bfe9987091a1d3634bf2a7630124d479822759ca274818bcf04ab", // ETH commit and close
    "0x277acd9f23da403d9c558025a979bd36e2294c7683a249597afb26cc4eb88658", // ETH roll to next options
    "0xb9c5b53397c30f25189ba53c35a3bc9c3fc9cb8be2922f215744386ce18feac1", // yv commit and close
    "0x337866fc845aa4cc0255431119d3dcfc9fea193eed2b539b0a0494652ce2ba5d",// yv roll to next options
]

// Alternative tx Hash for testing
// 0xed43121d795c49ba0bcc9db1e0918b7c1bbfaf3c07b2c513bcf8d171b6c86703 // WBTC commit and close
// 0xb9c5b53397c30f25189ba53c35a3bc9c3fc9cb8be2922f215744386ce18feac1 // yv commit and close
