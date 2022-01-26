import * as fs from 'fs';

export type Cache = {
    strike: {}
    pending: {}
    sent: {}
    last: number
};

const emptyCache: Cache = {
    strike: {},
    pending: {},
    sent: {},
    last: 0
}


export function readCache() {
    try {
        const buffer = fs.readFileSync(__dirname+'/.cache')

        return JSON.parse(buffer.toString()) as Cache
    } catch {
        fs.writeFile(
            __dirname+'/.cache', 
            JSON.stringify(emptyCache), 
            err => {
                if (err) {
                    console.error(err)
                    return
            }
        })

        return emptyCache
    }
}

export function writeCache(cache: Cache){
    fs.writeFile(
        __dirname+'/.cache', 
        JSON.stringify(cache), 
        err => {
            if (err) {
                console.error(err)
                return
        }
    })
}

export function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}