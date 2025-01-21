import { RedisClientType, createClient } from "redis";
import { DbMessage } from "./types/dbMessage";
import { WsMessage } from "./types/wsMessage";
import { MessageToApi } from "./types/apiMessage";

export class RedisManager {
    private static instance: RedisManager;
    private client: RedisClientType;

    private constructor() {
        this.client = createClient()
        this.client.connect()
    }

    public static getInstance() {
        if (!this.instance)  {
            this.instance = new RedisManager();
        }
        return this.instance;
    }

    public sendToApi(clientId: string, message: MessageToApi) {
        this.client.publish(clientId, JSON.stringify(message));
    }

    public publishMessage(channel: string, message: WsMessage) {
        this.client.publish(channel, JSON.stringify(message));
    }

    public pushMessage(message: DbMessage) {
        this.client.lPush('db_processor', JSON.stringify(message));
    }
}