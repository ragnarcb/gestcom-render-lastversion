import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faMoneyBill, faHandshake } from '@fortawesome/free-solid-svg-icons';
import './PaymentOptions.css';

const PaymentOptions = ({ selectedPayment, onSelectPayment }) => {
    const paymentMethods = [
        {
            id: 'card',
            icon: faCreditCard,
            label: 'Cartão'
        },
        {
            id: 'money',
            icon: faMoneyBill,
            label: 'Dinheiro'
        },
        {
            id: 'credit',
            icon: faHandshake,
            label: 'Fiado'
        }
    ];

    return (
        <div className="payment-options">
            {paymentMethods.map(method => (
                <button
                    key={method.id}
                    className={`payment-option ${selectedPayment === method.id ? 'selected' : ''}`}
                    onClick={() => onSelectPayment(method.id)}
                >
                    <FontAwesomeIcon icon={method.icon} />
                    <span>{method.label}</span>
                </button>
            ))}
        </div>
    );
};

export default PaymentOptions;