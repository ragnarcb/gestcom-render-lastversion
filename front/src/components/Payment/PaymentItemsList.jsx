import React from 'react';

const PaymentItemsList = ({ cart }) => {
    return (
        <div className="items-list-container">
            <div className="items-list">
                {cart.map((item, index) => (
                    <div key={index} className="item-row">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                        <span className="item-price">
                            R$ {(item.price * item.quantity).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentItemsList;
