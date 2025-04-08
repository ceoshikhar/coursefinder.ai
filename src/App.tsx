import { CartProvider } from "./context/cart-context";
import { CartList } from "./features/cart-list";
import { ProductList } from "./features/product-list";

function App() {
    return (
        <div>
            <CartProvider>
                <ProductList />
                <div className="h-10"></div>
                <CartList />
            </CartProvider>
        </div>
    );
}

export default App;
