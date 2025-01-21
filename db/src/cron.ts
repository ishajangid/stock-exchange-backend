import { Client } from 'pg'; 

const pgClient = new Client({
    user: 'your_user',
    host: 'localhost',
    database: 'my_database',
    password: 'your_password',
    port: 5432,
});
pgClient.connect();

async function refreshViews() {
    await pgClient.query('REFRESH MATERIALIZED VIEW klines_1m');
    await pgClient.query('REFRESH MATERIALIZED VIEW klines_1h');
    await pgClient.query('REFRESH MATERIALIZED VIEW klines_1w');
}

refreshViews().then(() => {
    console.log("Materialized views refreshed successfully");
}).catch((e) => {
    console.error("Error refreshing materialized views", e);
});

setInterval(() => {
    refreshViews()
}, 1000 * 10 );