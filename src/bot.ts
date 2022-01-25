import {
    AuctionList,
    strikeAssets,
} from "./constants"
import { Telegraf } from 'telegraf';
import { getEstimatedSizes, readCache, writeCache } from "./helpers";
import { estimatedSize, formatNumber, scheduleTemplate } from "./templates";
import { channel } from "diagnostics_channel";
import { schedule, Schedule } from "./schedule";
require("dotenv").config()

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.command('setstrike', (ctx) => {
    
    const query = ctx.message.text.trim();
    const args = query.split(" ").slice(1);

    // Check there arguments are complete
    if (args.length < 2) {
        ctx.reply(
            "Please specify the option and the strike price e.g. ETHput 2800."
        )
        return
    }

    // Check option is valid
    if (!Object.keys(strikeAssets).includes(args[0])) {
        ctx.reply(
            `Invalid option. Available options: \n${Object.keys(strikeAssets).join(", ")}.`
        )   
        return    
    }

    if (!Number(args[1])) {
        ctx.reply(
            "Strike needs to be a number"
        ) 
        return
    }

    let cache = readCache()
    cache.strike[args[0]] = Number(args[1])
    writeCache(cache)

    ctx.reply(
        `Strike price for $${args[0]} set at $${formatNumber(args[1])}.`
    )
})

bot.command('getsizes', async (ctx) => {
    const cache = readCache()
    const strikes = cache.strike

    if (!strikes) {
        ctx.reply(
            `Strike price for ETH put is not set.`
        )
        return
    }

    if (!strikes["ETHput"]) {
        ctx.reply(
            `Strike price for ETH put is not set.`
        )
        return
    }

    ctx.reply(
        `Strike price for ETH put is at $${formatNumber(strikes["ETHput"])}\n`
        + `Please update the strike price if this is incorrect using /setstrike.`
    )
    
    const sizes = await getEstimatedSizes(strikes)
    ctx.reply(
        estimatedSize(sizes)
    )
})

bot.command('getschedule', async (ctx) => {
    ctx.reply(
        scheduleTemplate(schedule)
    )
})

// bot.command('setschedule', async (ctx) => {
//     let cache = readCache()
//     let schedule = {}
//     const query = ctx.message.text.trim();
//     const lines = query.split("\n")
    
//     lines.slice(1).map((line) => {
//         const params = line.split(" ")
//         if (params.length > 3) {
//             ctx.reply(
//                 `For each auction, please set the timing with the following format [auction] [start] [end] e.g. WBTCcall 10.20 10.30. Timings are in UTC.`
//             )
//         }

//         const [vault, start, end] = params
//         schedule[vault] = [start, end]
//     })

//     cache.schedule = schedule
//     writeCache(cache)
// })

// bot.command('getscheduletemplate', async (ctx) => {
//     const lineTemplate = AuctionList.map((auction) => {
//         return `${auction} [start] [end]`
//     })
    
//     const reply = `Please use the following command to set the schedule:\n\n`
//         + lineTemplate.join("\n")
//         + `\nv1 [start] [end]`

//     ctx.reply(
//         reply
//     )
    
// })

bot.launch()