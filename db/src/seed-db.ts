import { Client } from 'pg';

const pgClient = new Client({
    user: 'your_user',
    host: 'localhost',
    database: 'my_database',
    password: 'your_password',
    port: 5432,
});

async function initialiseDb() {
    await pgClient.connect();

    await pgClient.query(`
        DROP TABLE IF EXISTS "tata_prices";
        CREATE TABLE "tata_prices" (
            time TIMESTAMP,
            price DOUBLE PRECISION,
            volume DOUBLE PRECISION,
            currency_code VARCHAR(10)
        );

        SELECT create_hypertable('tata_prices', 'time', 'price', 2);
    `);

    await pgClient.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1m AS
        SELECT
            time_bucket('1 minute', time) AS bucket,
            first(price, time) AS open,
            max(price) AS high,
            min(price) AS low,
            last(price, time) AS close,
            sum(volume) AS volume,
            currency_code
        FROM tata_prices
        GROUP BY bucket, currency_code;
    `);

    await pgClient.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1h AS
        SELECT
            time_bucket('1 hour', time) AS bucket,
            first(price, time) AS open,
            max(price) AS high,
            min(price) AS low,
            last(price, time) AS close,
            sum(volume) AS volume,
            currency_code
        FROM tata_prices
        GROUP BY bucket, currency_code;
    `);

    await pgClient.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1w AS
        SELECT
            time_bucket('1 week', time) AS bucket,
            first(price, time) AS open,
            max(price) AS high,
            min(price) AS low,
            last(price, time) AS close,
            sum(volume) AS volume,
            currency_code
        FROM tata_prices
        GROUP BY bucket, currency_code;
    `);

    await pgClient.end();
}

initialiseDb().then(() => {
    console.log('Database initialised');
}).catch((e) => {
    console.error('Error initialising database', e);
})