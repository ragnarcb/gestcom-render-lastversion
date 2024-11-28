import React, { memo } from 'react';
import './CartItem.css';

const CartItem = memo(({ item, onRemove, onIncrease, onDecrease }) => {
    return (
        <div className="cart-item">
            <button className="remove-button" onClick={() => onRemove(item)}>×</button>
            {item.imageSrc ? (
                <img
                    src={item.imageSrc}
                    alt={item.name}
                    onError={(e) => {
                        console.error('Erro ao carregar imagem:', e);
                        e.target.style.display = 'none';
                    }}
                    style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain' }}
                />
            ) : (
                <div
                    className="placeholder-image"
                    style={{
                        width: '100px',
                        height: '100px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '5px'
                    }}
                />
            )}
            <div className="cart-item-details">
                <div>{item.name}</div>
                <div>R$ {item.price.toFixed(2)}</div>
            </div>
            <div className="cart-item-buttons">
                <button onClick={() => onDecrease(item)}>-</button>
                <span>{item.quantity || 0}</span>
                <button onClick={() => onIncrease(item)}>+</button>
            </div>
        </div>
    );
});

CartItem.displayName = 'CartItem';

export default CartItem;