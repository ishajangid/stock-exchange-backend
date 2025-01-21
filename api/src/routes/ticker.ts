import { Router } from "express";
import { RedisManager } from "../RedisManager";
import { GET_TICKERS } from "../types";

export const tickerRouter = Router();

const redisManager = RedisManager.getInstance();

tickerRouter.get("/", async (req, res) => {
    const response: any = await redisManager.sendAndAwait({ 
        type: GET_TICKERS
    })
    
    res.json(response.payload);
})