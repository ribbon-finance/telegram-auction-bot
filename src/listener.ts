import { 
    vaultAddress, 
    externalAddress,
    VaultAddressMap,
    Auction, 
} from "./constants"
import { 
    auctionDetails, 
    liveAuction, 
    stETHExplanation, 
    yvUSDCExplanation
} from './templates';
import {
    decodeTransaction,
    decodeCommitAndClose,
    decodeRollToNextOption,
    getStethPrice,
    getYvusdcPrice,
} from "./helpers"

import { Telegram } from 'telegraf';
import Web3 from "web3"
import { readCache, writeCache } from "./utils";
import moment, { unix } from "moment-timezone";
import { schedule } from "./schedule";

require("dotenv").config()

const telegram: Telegram = new Telegram(process.env.BOT_TOKEN as string);
const chatId = process.env.CHAT_ID
const web3Ws = new Web3(process.env.WEBSOCKET_URL)
const buffer = 5*60

const transactionLedger = []

async function listenVaultEvents() {
    await web3Ws.eth.subscribe('logs', {
        address: [externalAddress.UniswapMulticall, ...Object.values(vaultAddress)]
    })
    .on("data", async function(transaction){
        await checkHash(transaction.transactionHash)
    })
}

export async function checkHash(hash, test=false) {
    if (!transactionLedger.includes(hash)) {
        transactionLedger.push(hash)
        let txDetails = await decodeTransaction(hash)
        let auction = Object.keys(VaultAddressMap).find(key => VaultAddressMap[key] === txDetails.to) as Auction;
        let addresses = [externalAddress.UniswapMulticall, ...Object.values(vaultAddress)]

        if (addresses.includes(txDetails.to)) {
            if (txDetails.method == "commitAndClose" || txDetails.method == "tryAggregate") {
                console.log(auction, txDetails.to, hash, txDetails.method)
                const details = await decodeCommitAndClose(hash, auction)

                let msg = auctionDetails(details)

                if (auction == "steth-call") {
                    const stethPrice = await getStethPrice();
                    msg = auctionDetails(details).concat("\n\n", stETHExplanation(stethPrice))
                } else if (auction == "eth-put") {
                    const yvUSDCPrice = await getYvusdcPrice();
                    msg = auctionDetails(details).concat("\n[Bids will be in USDC]", "\n\n", yvUSDCExplanation(yvUSDCPrice))
                }                
                
                let cache = readCache()
                cache.pending[auction+"-info"] = {
                    scheduled: moment.utc(schedule[auction].info, "HH.mm").unix(),
                    message: msg
                }

                writeCache(cache)

                if (test){
                    console.log(msg + "\n")
                }
            } else if (txDetails.method == "rollToNextOption") {
                console.log(auction, txDetails.to, hash, txDetails.method)
                const details = await decodeRollToNextOption(hash, auction)
                const msg = liveAuction(details)

                let cache = readCache()
                cache.pending[auction+"-open"] = {
                    scheduled: moment.utc(schedule[auction].open, "HH.mm").unix(),
                    message: msg
                }

                writeCache(cache)

                if (test){
                    console.log(msg + "\n")
                }
            }
        }
    } 
}

export async function main(listenerFunction) {
    await listenerFunction()
}

if (require.main === module) {
    main(listenVaultEvents)
}
