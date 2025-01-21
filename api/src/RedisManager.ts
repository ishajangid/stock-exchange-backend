import { RedisClientType, createClient } from "redis";

export class RedisManager {
    private static instance: RedisManager;
    private client: RedisClientType;
    private publisher: RedisClientType;

    private constructor() {
        this.client = createClient()
        this.client.connect()
        this.publisher = createClient()
        this.publisher.connect()
    }

    public static getInstance() {
        if (!RedisManager.instance) {
            RedisManager.instance = new RedisManager();
        }
        return RedisManager.instance;
    }

    public sendAndAwait(message: any) {
        return new Promise((resolve) => {
            const clientId = this.getRandomClientId()
            this.client.subscribe(clientId, (message) => {
                this.client.unsubscribe(clientId);
                // console.log('Received message', JSON.parse(message))
                resolve(JSON.parse(message))
            })
            this.publisher.lPush('messages', JSON.stringify({ clientId, message }))
        })
    }

    private getRandomClientId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}