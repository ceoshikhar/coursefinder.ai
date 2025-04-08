import {
    createContext,
    FC,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

export interface Product {
    id: number;
    name: string;
}

interface CartItem {
    product: Product;
    count: number;
}

interface CartContextType {
    items: CartItem[];

    addToCart: (item: CartItem) => void;
    setCartItemCount: (productID: number, count: number) => void;
    isAddedToCart: (product: Product) => boolean;
}

const CartContext = createContext<CartContextType>({
    items: [],

    addToCart: () => {},
    setCartItemCount: () => {},
    isAddedToCart: () => false,
});

const initCartState = () => {
    const cartStr = localStorage.getItem("cart");

    if (!cartStr) {
        return [];
    }

    const initState: CartItem[] = JSON.parse(cartStr);
    return initState;
};

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => initCartState());

    const isAddedToCart = useCallback(
        (product: Product) => {
            let found = false;

            for (let i = 0; i < items.length; i++) {
                if (items[i].product.id === product.id) {
                    found = true;
                    break;
                }
            }

            return found;
        },
        [items]
    );

    const addToCart = useCallback(
        (item: CartItem) => {
            if (isAddedToCart(item.product)) {
                window.alert("Product already added to cart.");
                return;
            }

            const copy = Array.from(items);
            copy.push(item);
            setItems(copy);
        },
        [isAddedToCart, items]
    );

    const setCartItemCount = useCallback(
        (productID: number, count: number) => {
            const copy: CartItem[] = [];

            items.forEach((item) => {
                if (item.product.id === productID) {
                    item.count = count;
                }

                if (count > 0) {
                    copy.push(item);
                }
            });

            setItems(copy);
        },
        [items]
    );

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const value = useMemo(() => {
        return {
            items,
            addToCart,
            setCartItemCount,
            isAddedToCart,
        };
    }, [addToCart, isAddedToCart, items, setCartItemCount]);

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw Error("useCart: forgot to wrap with CartProvider?");
    }

    return context;
};
