import moment from "moment-timezone";
import { Auction, getVaultName } from "./constants";
import { schedule, Schedule } from "./schedule";

export function formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const estimatedSize = (details) => { 
    const orderedSchedule = Object.keys(schedule).map((auction) => {
        return [auction, moment(schedule[auction].start, "HH.mm").unix()]
    }).sort((a, b) => {
        const first = a[1] as number
        const second = b[1] as number
        return first - second
    })

    const firstTime = moment.unix(orderedSchedule[0][1] as number).format("HH.mmA")

    return `These are the estimated sizes for out V2 vaults:\n\n`+
        `WBTC Call: ${formatNumber(details.RibbonThetaVaultWBTCCall)}\n` +
        `AAVE Call:  ${formatNumber(details.RibbonThetaVaultAAVECall)}\n` +
        `wstETH Call: ${formatNumber(details.RibbonThetaVaultSTETHCall)}\n` +
        `ETH Call:  ${formatNumber(details.RibbonThetaVaultETHCall)}\n` +
        `ETH Put:  ${formatNumber(details.RibbonThetaYearnVaultETHPut)} (Bid in USDC)\n\n` +
        `Please prepare the collateral needed to bid on the auctions beforehand because the auctions will only last for 10 minutes. See you at ${firstTime} UTC for the first auction.\n\n` +
        `Note: As we started deprecating v1 vaults a fortnight ago, there might be some difference between the actual auction amounts and the estimated amounts above as depositors migrate from our v1 to v2 vaults.`
}

export const auctionDetails = (details) => { 
    return `Hello everyone, the auction for our ${details.asset} ${details.type} options will begin in 5 minutes.\n`+
        `Here are the details:\n\n`+
        `Estimated Size: ${formatNumber(details.size)} ${details.asset}\n`+
        `Strike: $${formatNumber(details.strikePrice)}\n`+
        `Expiry: ${details.expiry}`
}

export const liveAuction = (details) => { 
    return `The ${details.asset} ${details.type} auction is now live:`+
        `${details.asset} Auction Link: https://gnosis-auction.eth.limo/#/auction?auctionId=${details.auctionId}&chainId=1#topAnchor`
}

export const stETHExplanation = (price) => {
    return `1 wstETH = ${price} ETH, so the price per wstETH call option is ${price}x the ETH call price.`
}

export const yvUSDCExplanation = (price) => {
    return `1 yvUSDC = ${price} USDC, so the price per ETH put option is ${price}x the ETH put price.`
}

export const scheduleTemplate = (schedule: Schedule) => {
    const orderedSchedule = Object.keys(schedule).map((auction) => {
        return [auction, moment(schedule[auction].start, "HH.mm").unix()]
    }).sort((a, b) => {
        const first = a[1] as number
        const second = b[1] as number
        return first - second
    })

    const orderedAuction = orderedSchedule.map((value) => {
        const auction = value[0] as Auction
        const auctionName = getVaultName(auction)
        const start = moment(schedule[auction].start, "HH.mm").format("HH.mmA")
        const end = moment(schedule[auction].end, "HH.mm").format("HH.mmA")

        return `${start}: ${auctionName} V2 Vault Auction starts\n` + 
            `${end}: ${auctionName} V2 Vault Auction ends\n`
    })

    return `Hello everyone, this will be the auction schedule for today; ${moment().format("Do MMM YYYY")} (UTC Time):\n\n`+
        `${orderedAuction.join("")}\n`+
        `V1 Auctions will be for the following assets:\n\n`+
        `AVAX Call\n\n` +
        `Estimated vault sizes will be posted at 9AM UTC\n`
}