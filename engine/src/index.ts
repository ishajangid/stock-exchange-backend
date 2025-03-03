import { createClient } from "redis"
import { Engine } from "./trade/Engine"

async function main() {
    const engine = new Engine()
    const redisClient = createClient()
    await redisClient.connect()

    while (true) {
        const response = await redisClient.rPop("messages" as string)
        if (!response) {

        } else {
            console.log(response)
            engine.process(JSON.parse(response));
        }
    }   
}

main()