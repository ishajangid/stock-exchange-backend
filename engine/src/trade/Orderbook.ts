import { BASE_CURRENCY } from "./Engine";

export interface Order {
    price: number;
    quantity: number;
    orderId: string;
    filled: number;
    side: "buy" | "sell";
    userId: string;
}

export interface Fill {
    price: string;
    qty: number;
    tradeId: number;
    otherUserId: string;
    markerOrderId: string;
}

export interface Trade {
    price: number;
    qty: number;
    time: Date;
}

export class Orderbook {
    bids: Order[];
    asks: Order[];
    baseAsset: string;
    quoteAsset: string = BASE_CURRENCY;
    lastTradeId: number;
    currentPrice: number;
    trades: Trade[];

    constructor(baseAsset: string, bids: Order[], asks: Order[], lastTradeId: number, currentPrice: number, trades: Trade[]) {
        this.bids = bids;
        this.asks = asks;
        this.baseAsset = baseAsset;
        this.lastTradeId = lastTradeId || 0;
        this.currentPrice = currentPrice || 0;
        const currentTime = new Date()
        const twentyFourHoursAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);
        const relevantTrades = trades.filter(trade => new Date(trade.time) >= twentyFourHoursAgo);
        if(relevantTrades.length > 0) {
            this.trades = relevantTrades;
        } else {
            this.trades = trades;
        }
    }

    ticker() {
        const currentTime = new Date()
        const twentyFourHoursAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);
        let relevantTrades = this.trades.filter(trade => new Date(trade.time) >= twentyFourHoursAgo);
        if(relevantTrades.length === 0) {
            relevantTrades = this.trades;
        }

        const firstPrice = relevantTrades[0]?.price;
        const lastPrice = this.currentPrice;
        const high = Math.max(...relevantTrades.map(trade => trade.price));
        const low = Math.min(...relevantTrades.map(trade => trade.price));
        const volume = relevantTrades.reduce((acc, trade) => acc + trade.qty, 0);
        const quoteVolume = relevantTrades.reduce((acc, trade) => acc + (trade.price * trade.qty), 0);
        const trades = relevantTrades.length;
        const priceChange = lastPrice - firstPrice;
        const priceChangePercent = (priceChange / firstPrice) * 100;
        this.trades = relevantTrades;

        return {
            firstPrice: firstPrice.toFixed(2),
            high: high.toFixed(2),
            lastPrice: lastPrice.toFixed(2),
            low: low.toFixed(2),
            priceChange: priceChange.toFixed(2),
            priceChangePercent: (priceChangePercent / 100).toFixed(6),
            quoteVolume: quoteVolume.toFixed(4),
            symbol: `${this.baseAsset}_${this.quoteAsset}`,
            trades,
            volume: volume.toFixed(2)
        };
    }

    getSnapshot() {
        return {
            baseAsset: this.baseAsset,
            bids: this.bids,
            asks: this.asks,
            lastTradeId: this.lastTradeId,
            currentPrice: this.currentPrice,
            trades: this.trades
        }
    }

    binarySearchInsert(arr: Order[], order: Order) {
        let left = 0;
        let right = arr.length;
    
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (this.compare(arr[mid], order) < 0) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
    
        arr.splice(left, 0, order);
    }
    
    compare(a: Order, b: Order) {
        return a.price - b.price;
    }

    addOrder(order: Order): {
        executedQty: number;
        fills: Fill[];
    } {
        if (order.side === "buy") {
            const { executedQty, fills } = this.matchBid(order);
            if (executedQty !== order.quantity) {
                const remainingOrder = {
                    ...order,
                    quantity: order.quantity - executedQty,
                    filled: 0
                }
                this.binarySearchInsert(this.bids, remainingOrder);
            }
            return { executedQty, fills };
        } else {
            const { executedQty, fills } = this.matchAsk(order);
            if (executedQty !== order.quantity) {
                const remainingOrder = {
                    ...order,
                    quantity: order.quantity - executedQty,
                    filled: 0
                }
                this.binarySearchInsert(this.asks, remainingOrder);
            }
            return { executedQty, fills };
        }
    }

    //check logic if u get it wrong
    matchBid(order: Order): { fills: Fill[], executedQty: number } {
        const fills: Fill[] = [];
        let executedQty = 0;

        for (let i = 0; i < this.asks.length; i++) {
            if (this.asks[i].price <= order.price && executedQty < order.quantity) {
                const filledQty = Math.min((order.quantity - executedQty), this.asks[i].quantity - this.asks[i].filled);
                executedQty += filledQty;
                this.asks[i].filled += filledQty;
                fills.push({
                    price: this.asks[i].price.toString(),
                    qty: filledQty,
                    tradeId: this.lastTradeId++,
                    otherUserId: this.asks[i].userId,
                    markerOrderId: this.asks[i].orderId
                });
                this.trades.push({
                    price: this.asks[i].price,
                    qty: filledQty,
                    time: new Date()
                });
            } else break;

            if (this.asks[i].filled === this.asks[i].quantity) {
                this.asks.splice(i, 1);
                i--;
            }
        }

        if(this.trades.length > 0) {
            this.currentPrice = this.trades[this.trades.length - 1].price;
        }
        return { fills, executedQty };
    }

    matchAsk(order: Order): { fills: Fill[], executedQty: number } {
        const fills: Fill[] = [];
        let executedQty = 0;

        for (let i = this.bids.length - 1; i >= 0; i--) {
            if (this.bids[i].price >= order.price && executedQty < order.quantity) {
                const amountRemaining = Math.min(order.quantity - executedQty, this.bids[i].quantity - this.bids[i].filled);
                executedQty += amountRemaining;
                this.bids[i].filled += amountRemaining;
                fills.push({
                    price: this.bids[i].price.toString(),
                    qty: amountRemaining,
                    tradeId: this.lastTradeId++,
                    otherUserId: this.bids[i].userId,
                    markerOrderId: this.bids[i].orderId
                });
                this.trades.push({
                    price: this.bids[i].price,
                    qty: amountRemaining,
                    time: new Date()
                });
            } else break;

            if (this.bids[i].filled === this.bids[i].quantity) {
                this.bids.splice(i, 1);
            }
        }

        if(this.trades.length > 0) {
            this.currentPrice = this.trades[this.trades.length - 1].price;
        }
        return { fills, executedQty };
    }

    //try a method to make it faster
    getDepth() {
        const bids: [string, string][] = [];
        const asks: [string, string][] = [];
        // console.log(this.bids[0].quantity - this.bids[0].filled);

        for (let i = 0; i < this.bids.length; i++) {
            let t: number = 0;
            while(i + 1 < this.bids.length && this.bids[i + 1].price === this.bids[i].price) {
                t += this.bids[i].quantity - this.bids[i].filled;
                i++;
            }
            t = t + this.bids[i].quantity - this.bids[i].filled;
            bids.push([this.bids[i].price.toString(), t.toString()]);
        }

        for (let i = 0; i < this.asks.length; i++) {
            let t: number = 0;
            while(i + 1 < this.asks.length && this.asks[i + 1].price === this.asks[i].price) {
                t += this.asks[i].quantity - this.asks[i].filled;
                i++;
            }
            t = t + this.asks[i].quantity - this.asks[i].filled;
            asks.push([this.asks[i].price.toString(), t.toString()]);
        }

        // console.log(bids, asks)
        return { bids, asks };
    }

    getOpenOrders(userId: string): Order[] {
        const asks = this.asks.filter(x => x.userId !== userId);
        const bids = this.bids.filter(x => x.userId !== userId);
        return [...asks, ...bids];
    }

    cancelBid(order: Order) {
        const index = this.bids.findIndex(x => x.orderId === order.orderId);
        if (index !== -1) {
            const price = this.bids[index].price;
            this.bids.splice(index, 1);
            return price
        }
    }

    cancelAsk(order: Order) {
        const index = this.asks.findIndex(x => x.orderId === order.orderId);
        if (index !== -1) {
            const price = this.asks[index].price;
            this.asks.splice(index, 1);
            return price
        }
    }

    getSymbol() {
        return `${this.baseAsset}_${this.quoteAsset}`
    }
}