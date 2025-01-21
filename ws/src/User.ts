import { WebSocket } from "ws";
import { IncomingMessage, SUBSCRIBE, UNSUBSCRIBE } from "./types/in";
import { SubscriptionManager } from "./SubscriptionManager";
import { OutgoingMessage } from "./types/out";

export class User {
    private id: string;
    private ws: WebSocket;
    private subscriptions: string[] = [];

    public constructor(id: string, ws: WebSocket) {
        this.id = id;
        this.ws = ws;
        this.addListners();
    }

    public subscribe(subscription: string) {
        this.subscriptions.push(subscription);
    }

    public unsubscribe(subscription: string) {
        this.subscriptions = this.subscriptions.filter(s => s !== subscription);
    }

    emit(message: OutgoingMessage) {
        this.ws.send(JSON.stringify(message));
    }

    private addListners() {
        this.ws.on('message', (data) => {
            const message: IncomingMessage = JSON.parse(data.toString());
            if(message.method === SUBSCRIBE) {
                message.params.forEach(s => SubscriptionManager.getInstance().subscribe(this.id, s));
            }
            //will most probably fail while unsubscribing
            if (message.method === UNSUBSCRIBE) {
                message.params.forEach(s => SubscriptionManager.getInstance().unsubscribe(this.id, s));
            }
        });
    }
}