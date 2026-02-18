import { createContext, useState } from "react";

//create a component to use createContext()
export const CartContext = createContext();


//wrap the  CartContext component into Context provider to specify the value for all components inside
export const CartProvider = ({ children }) => {
    const [price, setPrice] = useState(null);
    const [products, setProducts] = useState(null);
    return (
        <CartContext value={{ price, setPrice, products, setProducts }}>
            {children}
        </CartContext>
    )
}
