"use client";

import { useEffect, useState } from "react";
import { getDepth, getKlines, getTicker, getTrades } from "../../utils/httpClient";
import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";
import { SignallingManager } from "@/app/utils/SignallingManager";
import { Ticker } from "../../utils/types";

export function Depth({ market }: { market: string }) {
    const [bids, setBids] = useState<[number, number][]>();
    const [asks, setAsks] = useState<[number, number][]>();
    const [price, setPrice] = useState<string>();

    useEffect(() => {
        getDepth(market).then(d => {
            // console.log(d);
            // both bids and asks are sorted in increasing order
            const convertedBids = d.bids.reverse().map(bid => [Number(bid[0]), Number(bid[1])] as [number, number]);
            const convertedAsks = d.asks.map(ask => [Number(ask[0]), Number(ask[1])] as [number, number]);
            console.log(convertedBids, convertedAsks);
            setBids(convertedBids);
            setAsks(convertedAsks);
        });

        SignallingManager.getInstance().registerCallback("depth", (data: any) => {
            // console.log(data);

            //put data when u get in either ascending or descending order
            setBids((originalBids) => {
                const bidsAfterUpdate = [...(originalBids || [])];
                for (let j = 0; j < data.bids.length; j++) {
                    const [price, volume] = data.bids[j].map(Number);
                    const index = bidsAfterUpdate.findIndex(bid => bid[0] === price);
                    if (index !== -1) {
                        if (volume === 0) {
                            bidsAfterUpdate.splice(index, 1);
                        } else {
                            bidsAfterUpdate[index][1] = volume;
                        }
                    } else {
                        // Find the correct position to insert the new bid
                        const position = bidsAfterUpdate.findIndex(bid => bid[0] < price);
                        if (position === -1) {
                            bidsAfterUpdate.push([price, volume]);
                        } else {
                            bidsAfterUpdate.splice(position, 0, [price, volume]);
                        }
                        console.log(bidsAfterUpdate);
                    }
                }
                return bidsAfterUpdate;
            });
            
            setAsks((originalAsks) => {
                const asksAfterUpdate = [...(originalAsks || [])];
                for (let j = 0; j < data.asks.length; j++) {
                    const [price, volume] = data.asks[j].map(Number);
                    const index = asksAfterUpdate.findIndex(ask => ask[0] === price);
                    if (index !== -1) {
                        if (volume === 0) {
                            asksAfterUpdate.splice(index, 1);
                        } else {
                            asksAfterUpdate[index][1] = volume;
                        }
                    } else {
                        // Find the correct position to insert the new ask
                        const position = asksAfterUpdate.findIndex(ask => ask[0] > price);
                        if (position === -1) {
                            asksAfterUpdate.push([price, volume]);
                        } else {
                            asksAfterUpdate.splice(position, 0, [price, volume]);
                        }
                    }
                }
                return asksAfterUpdate;
            });            
        }, `DEPTH-${market}`);
        SignallingManager.getInstance().send({ "method": "SUBSCRIBE", "params": [`depth@${market}`] });
        SignallingManager.getInstance().registerCallback("ticker", (data: Partial<Ticker>) => setPrice(data.lastPrice), `TICKER1-${market}`);

        getTicker(market).then(t => setPrice(t.lastPrice));
        getTrades(market).then(t => setPrice(t[0].price));
        // getKlines(market, "1h", 1640099200, 1640100800).then(t => setPrice(t[0].close));
        return () => {
            SignallingManager.getInstance().send({ "method": "UNSUBSCRIBE", "params": [`depth.200ms.${market}`] });
            SignallingManager.getInstance().deRegisterCallback("depth", `DEPTH-${market}`);
            SignallingManager.getInstance().deRegisterCallback("ticker", `TICKER1-${market}`);
        }
    }, [])

    return <div>
        <TableHeader />
        {asks && <AskTable asks={asks} />}
        {price && <div className="py-1 px-2">{price}</div>}
        {bids && <BidTable bids={bids} />}
    </div>
}

function TableHeader() {
    return <div className="flex justify-between text-xs font-semibold px-2 py-1 sticky top-0 z-10 bg-slate-950">
        <div className="text-white">Price</div>
        <div className="text-slate-500">Size</div>
        <div className="text-slate-500">Total</div>
    </div>
}