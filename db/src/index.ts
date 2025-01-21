import { Client } from 'pg';
import { createClient } from 'redis';
import { TRADE_ADDED, DbMessage } from './types.ts';  

const pgClient = new Client({
    user: 'your_user',
    host: 'localhost',
    database: 'my_database',
    password: 'your_password',
    port: 5432,
});

async function main() {
    await pgClient.connect();
    const redisClient = createClient()
    redisClient.connect()
    
    while(true) {
        const response = await redisClient.rPop("db_processor")
        if (!response) {
            continue;
        } else {
            const data: DbMessage = JSON.parse(response);
            if(data.type === TRADE_ADDED) {
                const price = data.data.price;
                const timestamp = new Date(data.data.timestamp);
                const query = 'INSERT INTO tata_prices (time, price) VALUES ($1, $2)';
                // TODO: How to add volume?
                const values = [timestamp, price];
                await pgClient.query(query, values);
            }
        }
    }
}

main()