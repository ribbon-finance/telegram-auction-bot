export function formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const estimatedSize = (details) => { 
    return `These are the estimated sizes for out V2 vaults:

WBTC Call: ${formatNumber(details.RibbonThetaVaultWBTCCall)}
AAVE Call:  ${formatNumber(details.RibbonThetaVaultAAVECall)}
wstETH Call: ${formatNumber(details.RibbonThetaVaultSTETHCall)}
ETH Call:  ${formatNumber(details.RibbonThetaVaultETHCall)}
ETH Put:  ${formatNumber(details.RibbonThetaYearnVaultETHPut)} (Bid in USDC)

Please prepare the collateral needed to bid on the auctions beforehand because the auctions will only last for 10 minutes. See you at 10.20am UTC for the first auction.

Note: As we started deprecating v1 vaults a fortnight ago, there might be some difference between the actual auction amounts and the estimated amounts above as depositors migrate from our v1 to v2 vaults.`
}

export const auctionDetails = (details) => { 
    return `Hello everyone, the auction for our ${details.asset} ${details.type} options will begin in 10 minutes.

Here are the details:

Estimated Size: ${formatNumber(details.size)} ${details.asset}
Strike: $${formatNumber(details.strikePrice)}
Expiry: ${details.expiry}`
}

export const liveAuction = (details) => { 
    return `The ${details.asset} ${details.type} auction is now live:

${details.asset} Auction Link: https://gnosis-auction.eth.link/#/auction?auctionId=${details.auctionId}&chainId=1#topAnchor`
}

export const stETHExplanation = (price) => {
    return `1 wstETH = ${price} ETH, so the price per wstETH call option is ${price}x the ETH call price.`
}

export const yvUSDCExplanation = (price) => {
    return `1 yvUSDC = ${price} USDC, so the price per ETH put option is ${price}x the ETH put price.`
}