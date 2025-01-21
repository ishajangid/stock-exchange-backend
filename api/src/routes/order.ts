import { Router } from "express";
import { RedisManager } from "../RedisManager";
import { CREATE_ORDER, DELETE_ORDER, GET_OPEN_ORDERS } from "../types";

export const orderRouter = Router();

const redisManager = RedisManager.getInstance();

orderRouter.post("/", async (req, res) => {
    const {market, side, quantity, price, userId} = req.body;

    const response: any = await redisManager.sendAndAwait({
        type: CREATE_ORDER,
        data: {
            market,
            side,
            quantity,
            price,
            userId
        }
    })

    // console.log(response.payload);
    res.json(response.payload);
})

orderRouter.delete("/", async (req, res) => {
    //should have sent a userId as well
    const { orderId, market, userId } = req.body

    const response: any = await redisManager.sendAndAwait({
        type: DELETE_ORDER,
        data: {
            orderId,
            market,
            userId
        }
    })

    res.json(response.payload);
})

orderRouter.get("/open", async (req, res) => {
    const { userId, market } = req.query;
    // console.log(userId, market);

    const response: any = await RedisManager.getInstance().sendAndAwait({
        type: GET_OPEN_ORDERS,
        data: {
            userId,
            market
        }
    });

    res.json(response.payload);
});