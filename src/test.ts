import {
    main,
    checkHash
} from "./listener"
import {
    getEstimatedSizes
} from "./helpers"
import { mockAuctionSeries } from "./constants"
import { estimatedSize } from "./templates";
import { delay, readCache } from "./utils";
require("dotenv").config()

async function listenMockEvents() {
    const cache = readCache()
    
    const sizes = await getEstimatedSizes()
    console.log(estimatedSize(sizes))

    for (let i=0; i<mockAuctionSeries.length; i++) {
        await checkHash(mockAuctionSeries[i], true);
        await delay(6000)
    }
}

main(listenMockEvents)
