import {
    main,
    checkHash
} from "./listener"
import {
    delay, getEstimatedSizes
} from "./helpers"
import { mockAuctionSeries } from "./constants"
import * as fs from 'fs';
import { estimatedSize, formatNumber } from "./templates";
require("dotenv").config()

async function listenMockEvents() {
    const cache = fs.readFileSync(__dirname+'/.cache')
    const strikeCache = JSON.parse(cache.toString());

    console.log(
        `Strike price for ETH put is at $${formatNumber(strikeCache["ETHput"])}\n`
        + `Please update the strike price if this is incorrect using /setstrike.`
    )
    
    const sizes = await getEstimatedSizes(strikeCache)
    console.log(estimatedSize(sizes))

    for (let i=0; i<mockAuctionSeries.length; i++) {
        await checkHash(mockAuctionSeries[i], true);
        await delay(2000)
    }
}

main(listenMockEvents)
