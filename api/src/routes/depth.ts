import { Router } from 'express';
import { RedisManager } from '../RedisManager';
import { GET_DEPTH } from '../types';

export const depthRouter = Router();

const redisManager = RedisManager.getInstance();

depthRouter.get('/', async (req, res) => {
    const symbol = req.query.symbol;
    // console.log(symbol)

    if (!symbol || symbol === '') {
        res.status(400).send('Missing symbol');
        return;
    }

    const response: any = await redisManager.sendAndAwait({ 
        type: GET_DEPTH, 
        data: {
            market: symbol as string
        }
    })
    
    res.json(response.payload);
})