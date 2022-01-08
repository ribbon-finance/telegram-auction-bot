import {
    vaultTypes, 
    vaultAssets,
} from "./constants"
import { Telegraf } from 'telegraf';
import { getEstimatedSizes } from "./helpers";
import { estimatedSize, formatNumber } from "./templates";
require("dotenv").config()

const strikes = Object.keys(vaultTypes).reduce(
    (o, key) => ({ ...o, [vaultAssets[key]+vaultTypes[key]]: undefined}), {}
)

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.command('setstrike', (ctx) => {
    
    let query = ctx.message.text.trim();
    let args = query.split(" ").slice(1);

    // Check there arguments are complete
    if (args.length < 2) {
        ctx.reply(
            "Please specify the option and the strike price e.g. ETHput 2800."
        )
        return
    }

    // Check option is valid
    if (!Object.keys(strikes).includes(args[0])) {
        ctx.reply(
            `Invalid option. Available options: \n${Object.keys(strikes).join(", ")}.`
        )   
        return    
    }

    if (!Number(args[1])) {
        ctx.reply(
            "Strike needs to be a number"
        ) 
        return
    }

    strikes[args[0]] = Number(args[1])

    ctx.reply(
        `Strike price for $${args[0]} set at $${formatNumber(args[1])}.`
    )
})

bot.command('getsizes', async (ctx) => {
    if (!strikes["ETHput"]) {
        ctx.reply(
            `Strike price for ETH put is not set.`
        )
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
bot.launch()