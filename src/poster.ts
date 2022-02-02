import { Telegram } from 'telegraf';
import { delay, readCache, writeCache } from "./utils";
import moment, { unix } from "moment-timezone";
import { preauction, schedule, Schedule } from "./schedule";
import { estimatedSize, formatNumber, scheduleTemplate } from "./templates";
import { getEstimatedSizes } from './helpers';

require("dotenv").config()

const telegram: Telegram = new Telegram(process.env.BOT_TOKEN as string);
const chatId = process.env.CHAT_ID
const resetDuration = 5*60*60 // 5 hours
const sendReceipt = {
    schedule: false,
    strike: false,
    size: false,
}

async function main(interval: number){
    const schedulePost = moment.utc(preauction.schedule, "HH.mm d")
    const strikePost = moment.utc(preauction.strike, "HH.mm d")
    const sizePost = moment.utc(preauction.size, "HH.mm d")
    const auctionSchedule = schedule

    while (true) {
        let cache = readCache()
        let now = moment().unix()
        let last = cache.last
        let sent = cache.sent

        if (now >= last + resetDuration && Object.keys(sent).length > 0) {
            cache.sent = {}
            writeCache(cache)
        }

        if (now >= schedulePost.unix() && !sendReceipt.schedule) {
            await sendOrEditMessage("schedule", scheduleTemplate(auctionSchedule))
            sendReceipt.schedule = true
            await delay(1000)
        } else if (now >= strikePost.unix() && !sendReceipt.strike ) {
            const strike = cache.strike["ETHput"]
            await sendOrEditMessage("strike", `Please update the strike price for ETH Put.\nCurrent Strike Price: $${formatNumber(strike)}`)
            sendReceipt.strike = true
            await delay(1000)
        } else if (now >= sizePost.unix() && !sendReceipt.size) {
            const sizes = await getEstimatedSizes(cache.strike)
            await sendOrEditMessage("size", estimatedSize(sizes))
            sendReceipt.size = true
            await delay(1000)
        }
        
        let schedule = cache.pending
        let pending = Object.keys(schedule).map((event) => {
            return {
                ...schedule[event],
                key: event
            }
        })

        pending.sort((a, b) => {
            return a.scheduled - b.scheduled
        })

        for (let i=0; i < pending.length; i++){
            if (now >= pending[i].scheduled) {
                await sendOrEditMessage(pending[i].key, pending[i].message)
                await delay(1000)
            }
        }

        await delay(interval)
    }
}

async function sendOrEditMessage(key, text){
    let cache = readCache()

    if (!cache.sent[key]) {
        const msg = await telegram.sendMessage(
            chatId,
            text,
            {
                parse_mode:"HTML"
            }
        )
        cache.sent[key] = msg.message_id
    } else {
        try {
            await telegram.editMessageText(
                chatId,
                cache.sent[key],
                undefined,
                text,
                {
                    parse_mode:"HTML"
                }
            )

            const editTimestamp = moment().utc().format("MM/DD/YY HH:mm")
            await telegram.editMessageText(
                chatId,
                cache.sent[key],
                undefined,
                `[REVISED ${editTimestamp} UTC]\n\n` + text,
                {
                    parse_mode:"HTML"
                }
            )
        } catch {}
    }

    delete cache.pending[key]
    cache.last = moment().unix()
    console.log(`Sent ${key} ${cache.last}`)
    
    writeCache(cache)
}

if (require.main === module) {
    main(100)
}
