import {
    AuctionList,
    strikeAssets,
} from "./constants"
import { Telegraf } from 'telegraf';
import { getEstimatedSizes } from "./helpers";
import { estimatedSize, formatNumber, scheduleTemplate } from "./templates";
import { channel } from "diagnostics_channel";
import { schedule, Schedule } from "./schedule";
import { readCache, writeCache } from "./utils";
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
    const sizes = await getEstimatedSizes()
    ctx.reply(
        estimatedSize(sizes)
    )
})

bot.command('getschedule', async (ctx) => {
    ctx.reply(
        scheduleTemplate(schedule)
    )
})

bot.launch()