export type TickerUpdateMessage = {
    type: "ticker",
    data: {
        o?: string, 
        c?: string,
        h?: string,
        l?: string,
        v?: string,
        V?: string,
        n?: number,
        s?: string,
        e: "ticker"
    }
} 

export type DepthUpdateMessage = {
    type: "depth",
    data: {
        b?: [string, string][],
        a?: [string, string][],
        id: number,
        e: "depth"
    }
}

export type OutgoingMessage = TickerUpdateMessage | DepthUpdateMessage;