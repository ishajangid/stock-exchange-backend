"use client"

import { useEffect, useState } from "react";
import { Ticker } from "../utils/types";
import { getTicker } from "../utils/httpClient";
import { SignallingManager } from "../utils/SignallingManager";
import { TickerComponent } from "./Ticker";

export const MarketBar = ({ market }: { market: string }) => {
    const [ticker, setTicker] = useState<Ticker | null>(null);
    const [volume, setVolume] = useState<string>("INR");
    // console.log("MarketBar", ticker);

    useEffect(() => {
        getTicker(market).then(setTicker);
        SignallingManager.getInstance().registerCallback("ticker", (data: Partial<Ticker>) => setTicker(prevTicker => ({
            firstPrice: data?.firstPrice ?? prevTicker?.firstPrice ?? '',
            high: data?.high ?? prevTicker?.high ?? '',
            lastPrice: data?.lastPrice ?? prevTicker?.lastPrice ?? '',
            low: data?.low ?? prevTicker?.low ?? '',
            priceChange: data?.priceChange ?? prevTicker?.priceChange ?? '',
            priceChangePercent: data?.priceChangePercent ?? prevTicker?.priceChangePercent ?? '',
            quoteVolume: data?.quoteVolume ?? prevTicker?.quoteVolume ?? '',
            symbol: data?.symbol ?? prevTicker?.symbol ?? '',
            trades: data?.trades ?? prevTicker?.trades ?? '',
            volume: data?.volume ?? prevTicker?.volume ?? '',
        })), `TICKER-${market}`);
        SignallingManager.getInstance().send({ "method": "SUBSCRIBE", "params": [`ticker@${market}`] });

        return () => {
            SignallingManager.getInstance().deRegisterCallback("ticker", `TICKER-${market}`);
            SignallingManager.getInstance().send({ "method": "UNSUBSCRIBE", "params": [`ticker@${market}`] });
        }
    }, [market])

    const formatPrice = (price: number): string => {
        if (price === undefined) return "";
        return price.toFixed(price % 1 === 0 ? 2 : 2);
    };    

    return <div className="flex items-center justify-between flex-row no-scrollbar w-full gap-4 overflow-auto pr-4">
        <div className="flex h-[60px] shrink-0 space-x-4">
            <TickerComponent market={market as string} />
            <div className="flex items-center flex-row space-x-8">
                <div className="flex flex-col h-full justify-center">
                    <p className={`font-medium tabular-nums text-lg text-green-500`}>{formatPrice(Number(ticker?.lastPrice))}</p>
                    <p className="font-medium text-sm tabular-nums">${formatPrice(Number(ticker?.lastPrice))}</p>
                </div>
                <div className="flex flex-col">
                    <p className={`font-medium text-xs text-slate-400`}>24H Change</p>
                    <p className={` text-sm font-medium tabular-nums leading-5 text-greenText ${Number(ticker?.priceChange) > 0 ? "text-green-500" : "text-red-500"}`}>{Number(ticker?.priceChange) > 0 ? "+" : ""} {ticker?.priceChange} {Number(ticker?.priceChangePercent)?.toFixed(2)}%</p>
                </div>
                <div className="flex flex-col">
                    <p className="font-medium text-xs text-slate-400">24H High</p>
                    <p className="text-sm font-medium tabular-nums leading-5 ">{ticker?.high}</p>
                </div>
                <div className="flex flex-col">
                    <p className="font-medium text-xs text-slate-400">24H Low</p>
                    <p className="text-sm font-medium tabular-nums leading-5 ">{ticker?.low}</p>
                </div>
                <button type="button" className="font-medium transition-opacity hover:opacity-80 hover:cursor-pointer text-base text-left" onClick={() => setVolume(prev => {
                    if (prev === "INR") {
                        return "TATA"
                    } else {
                        return "INR"
                    }})}>
                    <div className="flex flex-col">
                        <p className="font-medium text-xs text-slate-400">24H Volume ({volume === "INR" ? "INR" : "TATA"})</p>
                        <p className="mt-1 text-sm font-medium tabular-nums leading-5 ">{volume === "INR" ? Number(ticker?.quoteVolume).toFixed(2)  : Number(ticker?.volume).toFixed(2)}</p>
                    </div>
                </button>
            </div>
        </div>
    </div>
}