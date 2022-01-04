import { 
    vaultAddress, 
    externalAddress, 
} from "./constants"
import { 
    estimatedSize, 
    auctionDetails, 
    liveAuction, 
    stETHExplanation 
} from './templates';
import {
    decodeTransaction,
    decodeCommitAndClose,
    decodeRollToNextOption,
    getStethPrice,
    getEstimatedSizes
} from "./helpers"

import { Telegram } from 'telegraf';
import Web3 from "web3"

require("dotenv").config()

const telegram: Telegram = new Telegram(process.env.BOT_TOKEN as string);
const chatId = process.env.CHAT_ID
const web3Ws = new Web3(process.env.WEBSOCKET_URL)

const transactionLedger = []

async function listenVaultEvents() {
    await web3Ws.eth.subscribe('logs', {
        address: [externalAddress.UniswapMulticall, ...Object.values(vaultAddress)]
    })
    .on("data", async function(transaction){
        await checkHash(transaction.transactionHash)
    })
}

export async function checkHash(hash) {
    if (!transactionLedger.includes(hash)) {
        transactionLedger.push(hash)
        let txDetails = await decodeTransaction(hash)
        let vault = Object.keys(vaultAddress).find(key => vaultAddress[key] === txDetails.to);
        let addresses = [externalAddress.UniswapMulticall, ...Object.values(vaultAddress)]

        if (addresses.includes(txDetails.to)) {
            console.log(vault, txDetails.to, txDetails.method)
            if (txDetails.method == "commitAndClose" || txDetails.method == "tryAggregate") {
                console.log(vault, txDetails.to, txDetails.method)
                const details = await decodeCommitAndClose(hash, vault)

                let msg = auctionDetails(details)

                if (vault == "RibbonThetaVaultSTETHCall") {
                    const stethPrice = await getStethPrice();
                    msg = auctionDetails(details).concat("\n\n", stETHExplanation(stethPrice))
                } else if (vault == "RibbonThetaYearnVaultETHPut") {
                    msg = auctionDetails(details).concat("\n[Bids will be in USDC]")
                }

                telegram.sendMessage(
                    chatId,
                    msg
                );
            } else if (txDetails.method == "rollToNextOption") {
                console.log(vault, txDetails.to, txDetails.method)
                const details = await decodeRollToNextOption(hash, vault)
                telegram.sendMessage(
                    chatId,
                    liveAuction(details)
                );
            }
        }
    } 
}

export async function main(listenerFunction) {
    const sizes = await getEstimatedSizes()

    telegram.sendMessage(
        chatId,
        estimatedSize(sizes)
    );

    await listenerFunction()
}

// main()
