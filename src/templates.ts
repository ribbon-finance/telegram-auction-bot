export const estimatedSize = (details) => { 
    return `These are the estimated sizes for out V2 vaults:

WBTC Call: ${details.RibbonThetaVaultWBTCCall}
AAVE Call:  ${details.RibbonThetaVaultAAVECall}
ETH Put:  ${details.RibbonThetaYearnVaultETHPut} (Bid in USDC)
wstETH Call: ${details.RibbonThetaVaultSTETHCall}
ETH Call:  ${details.RibbonThetaVaultETHCall}

Please prepare the collateral needed to bid on the auctions beforehand because the auctions will only last for 10 minutes. See you at 11am UTC for the first auction.

Note: As we are deprecating v1 vaults this week, there might be some difference between the actual auction amounts and the estimated amounts above as depositors migrate from v1 to our v2 vaults.

Will post another estimate closer to 11am UTC.`
}

export const auctionDetails = (details) => { 
    return `Hello everyone, the auction for our ${details.asset} ${details.type} options will begin in 10 minutes.

Here are the details:

Estimated Size: ${details.size} ${details.asset}
Strike: $${details.strikePrice}
Expiry: ${details.expiry}`
}

export const liveAuction = (details) => { 
    return `The ${details.asset} ${details.type} auction is now live:
Final Size: ${details.depositAmount}

${details.asset} Auction Link: https://gnosis-auction.eth.link/#/auction?auctionId=${details.auctionId}&chainId=1#topAnchor`
}

export const stETHExplanation = (price) => {
    return `1 wstETH = ${price} ETH, so the price per wstETH call option is ${price}x the ETH call option.`
}