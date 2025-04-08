import {
    createContext,
    FC,
    PropsWithChildren,
    useCallback,
    useContext,
    useMemo,
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
    // getByProductID: (productID: number) => CartItem | undefined;
}

const CartContext = createContext<CartContextType>({
    items: [],

    addToCart: () => {},
    setCartItemCount: () => {},
    isAddedToCart: () => false,
    // getByProductID: () => undefined,
});

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

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

    // const getByProductID = useCallback(
    //     (productID: number) => {
    //         let item: CartItem | undefined = undefined;

    //         for (let i = 0; i < items.length; i++) {
    //             if (items[i].product.id === productID) {
    //                 item = items[i];
    //                 break;
    //             }
    //         }

    //         return item;
    //     },
    //     [items]
    // );

    const value = useMemo(() => {
        return {
            items,
            addToCart,
            setCartItemCount,
            isAddedToCart,
            // getByProductID,
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
