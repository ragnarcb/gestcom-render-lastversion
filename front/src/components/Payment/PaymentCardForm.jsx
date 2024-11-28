import React from 'react';

const PaymentCardForm = ({ total }) => {
    return (
        <div className="payment-input-section">
            <div className="payment-field">
                <div className="total-display">
                    Valor a ser cobrado no cartão: R$ {total.toFixed(2)}
                </div>
            </div>
        </div>
    );
};

export default PaymentCardForm;
