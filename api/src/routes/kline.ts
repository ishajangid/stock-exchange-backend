import { Router } from "express";
import { Client } from "pg";

const pgClient = new Client({
    user: 'your_user',
    host: 'localhost',
    database: 'my_database',
    password: 'your_password',
    port: 5432,
});
pgClient.connect();

export const klineRouter = Router();

klineRouter.get("/", async (req, res) => {
    const { symbol, interval, startTime, endTime } = req.query;

    let query
    switch(interval) {
        case '1m':
            query = `SELECT * FROM kline_1m WHERE bucket >= $1 AND bucket <= $2`;
            break;
        case '1h':
            query = `SELECT * FROM kline_1h WHERE bucket >= $1 AND bucket <= $2`;
            break;
        case '1w':
            query = `SELECT * FROM kline_1w WHERE bucket >= $1 AND bucket <= $2`;
            break;
        default:
            return res.status(400).send('Invalid interval');
    }

    try {
        //@ts-ignore
        const result = await pgClient.query(query, [new Date(startTime * 1000 as string), new Date(endTime * 1000 as string)]);
        res.json(result.rows.map(x => ({
            close: x.close,
            end: x.bucket,
            high: x.high,
            low: x.low,
            open: x.open,
            quoteVolume: x.quoteVolume,
            start: x.start,
            trades: x.trades,
            volume: x.volume
        })))
    } catch (e) {
        console.error(e + "abey idhar se eror ailaa hai");
        res.status(500).send('Internal server error');
    }
})