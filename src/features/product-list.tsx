import { useCallback, useEffect, useState } from "react";
import { Product, useCart } from "../context/cart-context";

const products: Product[] = [
    {
        id: 1,
        name: "Product 1",
    },
    {
        id: 2,
        name: "Product 2",
    },
    {
        id: 3,
        name: "Product 3",
    },
];

export const ProductList = () => {
    // Map<productId, count>
    const [cartCounts, setCartCounts] = useState<Map<number, number>>(
        new Map()
    );

    const handleCartCountChange = useCallback(
        (productID: number, count: number) => {
            const copy = new Map(cartCounts);
            copy.set(productID, count);
            setCartCounts(copy);
        },
        [cartCounts]
    );

    const { items, addToCart, isAddedToCart, setCartItemCount } = useCart();

    const handleSetCartCount = (productID: number) => {
        let count = cartCounts.get(productID);
        if (!count) {
            count = 0;
        }

        setCartItemCount(productID, count);
    };

    const handleAddToCart = (product: Product) => {
        addToCart({ product, count: 1 });
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
            <h1 className="text-3xl">Product List</h1>
            <ul>
                {products.map((product) => {
                    return (
                        <li key={product.id} className="mt-2 flex gap-3">
                            {product.name}
                            {isAddedToCart(product) ? (
                                <>
                                    <p>{"Added  to cart"}</p>
                                    <input
                                        className="border-2 border-amber-800"
                                        value={cartCounts.get(product.id) || 0}
                                        onChange={(e) =>
                                            handleCartCountChange(
                                                product.id,
                                                Number(e.target.value || 0)
                                            )
                                        }
                                    />
                                    <button
                                        className="bg-amber-400 text-black"
                                        onClick={() =>
                                            handleSetCartCount(product.id)
                                        }
                                    >
                                        Update Count
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="bg-amber-400 text-black"
                                    onClick={() => handleAddToCart(product)}
                                >
                                    Add To Cart
                                </button>
                            )}
                        </li>
                    );
                })}
            </ul>
        </>
    );
};
