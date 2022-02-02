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
    schedule: "06:00 5",
    strike: "08:00 5",
    size: "09:20 5",
}

export const schedule: Schedule = {
    "wbtc-call":
        {   
            start: "10.20",
            end: "10.30",
            info: "10.15",
            open: "10.19",
        },
    "aave-call":
        {   
            start: "10.30",
            end: "10.40",
            info: "10.25",
            open: "10.29",
        },
    "steth-call":
        {   
            start: "10.40",
            end: "10.50",
            info: "10.35",
            open: "10.39",
        },
    "eth-call":
        {   
            start: "10.50",
            end: "11.00",
            info: "10.45",
            open: "10.49",
        },
    "eth-put":
        {   
            start: "11.00",
            end: "11.10",
            info: "10.55",
            open: "10.59",
        },
}