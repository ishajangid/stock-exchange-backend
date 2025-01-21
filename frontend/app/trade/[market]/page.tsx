"use client";

import { MarketBar } from "@/app/components/MarketBar";
import { SwapUI } from "@/app/components/SwapUI";
import { TradeView } from "@/app/components/TradeView";
import { Depth } from "@/app/components/depth/Depth";
import { useParams } from "next/navigation";
import React, { useRef } from "react";

export default function Page() {
    const { market } = useParams();
    const depthContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="flex flex-row flex-1">
            <div className="flex flex-col flex-1">
                <MarketBar market={market as string} />
                <div className="flex flex-row h-[610px] border-y border-slate-800">
                    <div className="flex flex-col flex-1">
                        <TradeView market={market as string} />
                    </div>
                    <div className="w-[1px] flex-col border-slate-800 border-l"></div>
                    <div className="flex flex-col w-[275px] overflow-hidden relative">
                        <div
                            ref={depthContainerRef}
                            style={{
                                height: '100%',
                                overflowY: 'scroll',
                                scrollbarWidth: 'none', 
                                msOverflowStyle: 'none', 
                            }}
                            className="no-scrollbar"
                        >
                            <Depth market={market as string} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-[1px] flex-col border-slate-800 border-l"></div>
            <div className="flex flex-col w-[300px]">
                <SwapUI market={market as string} />
            </div>
        </div>
    );
}

const styles = `
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);