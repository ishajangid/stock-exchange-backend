interface AskProps {
    price: number;
    quantity: number;
    total: number;
    maxTotal: number;
}

interface AskTableProps {
    asks: [number, number][];
}

export const AskTable = ({ asks }: AskTableProps) => {
    let currentTotal = 0;
    const relevantAsks = asks.slice(0, 20);
    const asksWithTotal: [number, number, number][] = relevantAsks.map(([price, quantity]) => [price, quantity, currentTotal += quantity]);
    const maxTotal = relevantAsks.reduce((acc, [, quantity]) => acc + quantity, 0);
    asksWithTotal.reverse();

    return (
        <div>
            {asksWithTotal.map(([price, quantity, total]) => (
                <Ask 
                    maxTotal={maxTotal} 
                    key={price.toString()} 
                    price={price} 
                    quantity={quantity} 
                    total={total} 
                />
            ))}
        </div>
    );
}

const Ask = ({ price, quantity, total, maxTotal }: AskProps) => {
    return (
        <div
            style={{
                display: "flex",
                position: "relative",
                width: "100%",
                backgroundColor: "transparent",
                overflow: "hidden",
            }}
            className="py-0.5 px-2"
        >
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: `${(100 * total) / maxTotal}%`,
                    height: "100%",
                    background: "rgba(228, 75, 68, 0.325)",
                    transition: "width 0.3s ease-in-out",
                }}
            ></div>
            <div className="flex justify-between text-xs w-full">
                <div>{price.toFixed(2)}</div>
                <div>{quantity.toFixed(2)}</div>
                <div>{total.toFixed(2)}</div>
            </div>
        </div>
    );
}
