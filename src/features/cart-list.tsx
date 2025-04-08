import { useEffect, useState } from "react";
import { useCart } from "../context/cart-context";

export const CartList = () => {
    const [cartCounts, setCartCounts] = useState<Map<number, number>>(
        new Map()
    );

    const { items, setCartItemCount } = useCart();

    const handleCartCountChange = (productID: number, count: number) => {
        const copy = new Map(cartCounts);
        copy.set(productID, count);
        setCartCounts(copy);
    };

    const handleSetCartCount = (productID: number) => {
        let count = cartCounts.get(productID);

        if (!count) {
            count = 0;
        }

        setCartItemCount(productID, count);
    };

    useEffect(() => {
        const updated: Map<number, number> = new Map();

        items.forEach((item) => {
            updated.set(item.product.id, item.count);
        });

        setCartCounts(updated);
    }, [items]);

    return (
        <>
            <h1>Cart List</h1>
            {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                    <p>Prouct: {item.product.name}</p>
                    <p>Count: {item.count}</p>
                    <input
                        className="border-2 border-amber-800"
                        value={cartCounts.get(item.product.id) || 0}
                        onChange={(e) =>
                            handleCartCountChange(
                                item.product.id,
                                Number(e.target.value || 0)
                            )
                        }
                    />
                    <button
                        className="bg-amber-400 text-black"
                        onClick={() => handleSetCartCount(item.product.id)}
                    >
                        Update Count
                    </button>
                </div>
            ))}
        </>
    );
};
