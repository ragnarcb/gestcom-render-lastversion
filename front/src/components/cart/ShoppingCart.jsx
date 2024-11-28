import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import CartItem from './cartItem/CartItem';
import './ShoppingCart.css';

const ShoppingCart = ({ cart, removeFromCart, addToCart, decreaseQuantity }) => {
    const scrollContainer = (direction) => {
        const container = document.querySelector('.cart-container-inner');
        const scrollAmount = container.clientWidth / 2;
        if (direction === 'left') {
            container.scrollLeft -= scrollAmount;
        } else {
            container.scrollLeft += scrollAmount;
        }
    };

    if (cart.length === 0) return null;

    return (
        <div className={`cart-container ${cart.length > 10 ? 'scrollable' : ''}`}>
            {cart.length > 10 && (
                <button className="scroll-button left" onClick={() => scrollContainer('left')}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
            )}
            <div className="cart-container-inner">
                {cart.map((item, index) => (
                    <CartItem
                        key={index}
                        item={item}
                        onRemove={removeFromCart}
                        onIncrease={addToCart}
                        onDecrease={decreaseQuantity}
                    />
                ))}
            </div>
            {cart.length > 10 && (
                <button className="scroll-button right" onClick={() => scrollContainer('right')}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            )}
        </div>
    );
};

export default ShoppingCart;
