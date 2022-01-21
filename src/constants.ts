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
    "yvUSDC": "0xa354f35829ae975e850e23e9615b11da1b3dc4de",//"0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9",
    "stETH": "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
    "UniswapMulticall": "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
    "ETHUSDChainlinkOracle": "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
}

export const mockAuctionSeries = [
    // "0xbe1167074aa22eeab43f43956af6966e93952b4bb3774d810cd14bed89c0d4b9", // WBTC commit and close
    // "0xf2078985099769b0b925708711c55b0776a6ecd971a69ee1a4d352427df95a59", // WBTC roll to next options
    // "0x448112ea002135fd65df3c87c8b066c849a38f305df3d16e1cbd40ac4de1189e", // AAVE commit and close
    // "0x2c53d424c1b490bf9bac4e7bda8bfca354785c7db87bb5487682c633d4b1385e", // Additional?
    // "0x1496a445e177f62e3673438b8d0c4f52d52625270bb1eb6eff919e766819ad51", // AAVE roll to next options
    // "0x64a720e829aae36fde30ac0f253fb56169f1bdc713c9dd1c1243833d859101e2", // STETH commit and close
    // "0x3e2bc7f2256a9153aed984cf5a47bf854e346ad008451b77417a639889e1e0d9", // STETH roll to next options
    // "0xaac9df8d3697527e7042aceed49d7be964d09277dbea0dd4e75e2715f3244077", // ETH commit and close
    // "0x284c2e190eed8ff963999996bd77bac09895ecfe8149b7f549110025df13e8b8", // ETH roll to next options
    "0xe00dca873c77f4e97ca2d106fa585c1ff9f466f434802b06b5fc85c2c8830ed0", // yv commit and close
    "0xe995e384c0bed6fe45bdfe48f63c16e608f25774387f504703d6a03f37487d1e",// yv roll to next options
]

// Alternative tx Hash for testing
// 0xed43121d795c49ba0bcc9db1e0918b7c1bbfaf3c07b2c513bcf8d171b6c86703 // WBTC commit and close
// 0xb9c5b53397c30f25189ba53c35a3bc9c3fc9cb8be2922f215744386ce18feac1 // yv commit and close
// 0x2c53d424c1b490bf9bac4e7bda8bfca354785c7db87bb5487682c633d4b1385e // try Aggregate RibbonThetaVaultSTETHCall