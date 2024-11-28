import { useState, useCallback } from 'react';

export const useCart = () => {
    const [cart, setCart] = useState([]);

    const addToCart = useCallback((product) => {
        if (!product) return;

        setCart(prevCart => {
            const productIndex = prevCart.findIndex(p => p.id === product.id);

            if (productIndex !== -1) {
                const newCart = [...prevCart];
                newCart[productIndex] = {
                    ...newCart[productIndex],
                    quantity: (newCart[productIndex].quantity || 0) + 1
                };
                return newCart;
            } else {
                const productElement = document.querySelector(`[data-product-id="${product.id}"] img`);
                const processedImageUrl = productElement ? productElement.src : null;

                const cartProduct = {
                    id: product.id,
                    name: product.nome,
                    price: product.preco,
                    imageSrc: processedImageUrl,
                    quantity: 1
                };
                return [...prevCart, cartProduct];
            }
        });
    }, []);

    const removeFromCart = useCallback((item) => {
        if (!item) return;
        setCart(prevCart => prevCart.filter(cartItem => cartItem.id !== item.id));
    }, []);

    const decreaseQuantity = useCallback((item) => {
        if (!item) return;
        setCart(prevCart => {
            const productIndex = prevCart.findIndex(p => p.id === item.id);
            if (productIndex === -1) return prevCart;

            const newCart = [...prevCart];
            if (newCart[productIndex].quantity > 1) {
                newCart[productIndex] = {
                    ...newCart[productIndex],
                    quantity: newCart[productIndex].quantity - 1
                };
                return newCart;
            } else {
                return newCart.filter(cartItem => cartItem.id !== item.id);
            }
        });
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    return {
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        clearCart
    };
};