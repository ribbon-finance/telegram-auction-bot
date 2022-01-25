import { Auction } from "./constants";

export type Schedule = {
    [auction in Auction]: {
        start: string
        end: string
    }
}

export const schedule: Schedule = {
    "wbtc-call":
        {
            start: "10.20",
            end: "10.30"
        },
    "aave-call":
        {
            start: "10.30",
            end: "10.40"
        },
    "steth-call":
        {
            start: "10.40",
            end: "10.50"
        },
    "eth-call":
        {
            start: "10.50",
            end: "11.00"
        },
    "eth-put":
        {
            start: "11.00",
            end: "11.10"
        },
}