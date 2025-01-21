import { Router } from "express";

export const tradeRouter = Router();

tradeRouter.get("/", (req, res) => {
    const { symbol } = req.query;
    //make a db call and get all the trades for the symbol
    res.json({});
})