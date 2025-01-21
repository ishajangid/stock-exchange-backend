import React from 'react';

interface BidProps {
    price: number;
    quantity: number;
    total: number;
    maxTotal: number;
}

interface BidTableProps {
    bids: [number, number][];
}

export const BidTable = ({ bids }: BidTableProps) => {
    let currentTotal = 0; 
    const relevantBids = bids.slice(0, 20);
    const bidsWithTotal: [number, number, number][] = relevantBids.map(([price, quantity]) => [price, quantity, currentTotal += quantity]);
    const maxTotal = relevantBids.reduce((acc, [, quantity]) => acc + quantity, 0);

    return (
        <div>
            {bidsWithTotal.map(([price, quantity, total]) => (
                <Bid 
                    maxTotal={maxTotal}  
                    total={total} 
                    key={price.toString()} 
                    price={price} 
                    quantity={quantity} 
                />
            ))}
        </div>
    );
}

const Bid = ({ price, quantity, total, maxTotal }: BidProps) => {
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
                    background: "rgba(1, 167, 129, 0.325)",
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
