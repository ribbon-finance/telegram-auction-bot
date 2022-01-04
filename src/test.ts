import {
    main,
    checkHash
} from "./listener"
import {
    delay
} from "./helpers"
import { mockAuctionSeries } from "./constants"
require("dotenv").config()

async function listenMockEvents() {
    for (let i=0; i<mockAuctionSeries.length; i++) {
        await checkHash(mockAuctionSeries[i]);
        await delay(5000)
    }
}

main(listenMockEvents)
