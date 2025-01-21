export type TickerUpdateMessage = {
    stream: string,
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
    stream: string,
    data: {
        b?: [string, string][],
        a?: [string, string][],
        e: "depth"
    }
}

export type TradeAddedMessage = {
    stream: string,
    data: {
        e: "trade",
        t: number,
        m: boolean,
        p: string,
        q: string,
        s: string,
    }
}

export type WsMessage = TickerUpdateMessage | DepthUpdateMessage | TradeAddedMessage;