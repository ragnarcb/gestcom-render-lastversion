import React from 'react';
import PaymentMoneyForm from './PaymentMoneyForm';
import PaymentCardForm from './PaymentCardForm';
import PaymentCreditForm from './PaymentCreditForm';
import PaymentItemsList from './PaymentItemsList';
import './PaymentContent.css';

const PaymentContent = ({
    selectedPayment,
    total,
    cart,
    onClose,
    selectedCustomer,
    setSelectedCustomer
}) => {
    const renderPaymentForm = () => {
        switch (selectedPayment) {
            case 'money':
                return (
                    <PaymentMoneyForm 
                        total={total} 
                        cart={cart}
                    />
                );
            case 'card':
                return (
                    <PaymentCardForm 
                        total={total} 
                        cart={cart}
                    />
                );
            case 'credit':
                return (
                    <PaymentCreditForm 
                        total={total}
                        cart={cart}
                        selectedCustomer={selectedCustomer}
                        setSelectedCustomer={setSelectedCustomer}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="payment-details">
            <div className="payment-summary">
                <div className="total-section">
                    <h3>Total a Pagar</h3>
                    <div className="total-amount">
                        R$ {total.toFixed(2)}
                    </div>
                </div>
                <PaymentItemsList cart={cart} />
                {renderPaymentForm()}
            </div>
        </div>
    );
};

export default PaymentContent;
