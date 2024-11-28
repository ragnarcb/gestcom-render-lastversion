import React, { useState, useEffect } from 'react';
import CustomerSearch from './CustomerSearch';

const PaymentCreditForm = ({ total, selectedCustomer, setSelectedCustomer }) => {
    const [error, setError] = useState(null);

    return (
        <div className="payment-input-section">
            <CustomerSearch
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
                setError={setError}
            />
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default PaymentCreditForm;
