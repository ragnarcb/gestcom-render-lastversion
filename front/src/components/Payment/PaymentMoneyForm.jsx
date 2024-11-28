import React, { useState } from 'react';

const PaymentMoneyForm = ({ total }) => {
    const [cashAmount, setCashAmount] = useState('');

    const calculateChange = () => {
        const change = parseFloat(cashAmount) - total;
        return change > 0 ? change.toFixed(2) : '0.00';
    };

    return (
        <div className="payment-input-section">
            <div className="payment-field">
                <label>Valor Recebido</label>
                <input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    placeholder="Digite o valor recebido"
                    step="0.01"
                    min={total}
                />
                {parseFloat(cashAmount) >= total && (
                    <div className="change-amount">
                        Troco: R$ {calculateChange()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentMoneyForm;
