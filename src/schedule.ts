import { Auction } from "./constants";

export type Schedule = {
    [auction in Auction]: {
        start: string
        end: string
        info: string
        open: string
    }
}

export const preauction = {
    schedule: "04:25 3",
    strike: "04:26 3",
    size: "04:27 3",
}

export const schedule: Schedule = {
    "wbtc-call":
        {   
            start: "10.20",
            end: "10.30",
            info: "04:53",
            open: "04:54",
        },
    "aave-call":
        {   
            start: "10.30",
            end: "10.40",
            info: "04:55",
            open: "04:56",
        },
    "steth-call":
        {   
            start: "10.40",
            end: "10.50",
            info: "04:57",
            open: "04:58",
        },
    "eth-call":
        {   
            start: "10.50",
            end: "11.00",
            info: "04:59",
            open: "05:00",
        },
    "eth-put":
        {   
            start: "11.00",
            end: "11.10",
            info: "05:01",
            open: "05:02",
        },
}