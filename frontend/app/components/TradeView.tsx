import { useEffect, useRef } from "react";
import { ChartManager } from "../utils/ChartManager";
import { KLine } from "../utils/types";
import { getKlines } from "../utils/httpClient";

export const TradeView = ({ market }: { market: string }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartManagerRef = useRef<ChartManager>(null);

    useEffect(() => {
        const main = async () => {
            const klineData: KLine[] = await getKlines(market, '1m', 1720053000, 1720104653);
            if (chartRef) {
                if (chartManagerRef.current) {
                    chartManagerRef.current.destroy();  
                }

                const chartManager = new ChartManager(
                    chartRef.current,
                    [
                        ...klineData?.map((x) => ({
                            close: parseFloat(x.close),
                            high: parseFloat(x.high),
                            low: parseFloat(x.low),
                            open: parseFloat(x.open),
                            timestamp: new Date(x.end),
                        })),
                    ].sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1)) || [],
                    {
                        background: "#0e0f14",
                        color: "white",
                    }
                );
                //@ts-ignore
                chartManagerRef.current = chartManager;
            }
        }
        main()
    }, [market, chartRef])

    return (
        <div ref={chartRef} style={{ height: "520px", width: "100%", marginTop: 4 }} />
    )
}
