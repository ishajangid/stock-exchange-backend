import { Ticker } from "./types";

// export const BASE_URL = "wss://ws.backpack.exchange/"
export const BASE_URL = "ws://localhost:3001";

export class SignallingManager {
    private static instance: SignallingManager;
    private ws: WebSocket;
    private bufferedMessages: any[];
    private callbacks: any = {};
    private id: number;
    private initialized: boolean = false;

    private constructor() {
        this.ws = new WebSocket(BASE_URL);
        this.bufferedMessages = [];
        this.id = 1;
        this.init();
    }
    
    init() {
        this.ws.onopen = () => {
            this.initialized = true;
            this.bufferedMessages.forEach((message) => {
                this.send(message);
            });
            this.bufferedMessages = [];
        }
        
        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const type = message.data.e;
            if (this.callbacks[type]) {
                //@ts-ignore
                this.callbacks[type].forEach(({ callback }) => {
                    if (type === "ticker") {
                        const newTicker: Partial<Ticker> = {
                            lastPrice: message.data.c,
                            high: message.data.h,
                            low: message.data.l,
                            volume: message.data.v,
                            quoteVolume: message.data.V,
                            symbol: message.data.s,
                        }

                        callback(newTicker);
                    }
                    if (type === "depth") {
                        const updatedBids = message.data.b;
                        const updatedAsks = message.data.a;
                        callback({ bids: updatedBids, asks: updatedAsks });
                    }
                });
            }
        }
    }

    public static getInstance(): SignallingManager {
        if (!SignallingManager.instance) {
            SignallingManager.instance = new SignallingManager();
        }
        return SignallingManager.instance;
    }

    send(message: any) {
        const messageToSend = {
            ...message,
            id: this.id++
        };
        if (!this.initialized) {
            this.bufferedMessages.push(messageToSend);
        } else {
            this.ws.send(JSON.stringify(messageToSend));
        }
    }

    async registerCallback(type: string, callback: any, id: string) {
        if (!this.callbacks[type]) {
            this.callbacks[type] = [];
        }
        this.callbacks[type].push({ callback, id });
    }

    async deRegisterCallback(type: string, id: string) {
        if (this.callbacks[type]) {
            //@ts-ignore
            const index = this.callbacks[type].findIndex(callback => callback.id === id);
            if (index !== -1) {
                this.callbacks[type].splice(index, 1);
            }
        }
    }
}