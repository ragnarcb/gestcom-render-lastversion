import React, { useState, useEffect } from 'react';
import api from '../../services/Api';

const CustomerSearch = ({ selectedCustomer, setSelectedCustomer, setError }) => {
    const [customerSearch, setCustomerSearch] = useState('');
    const [customers, setCustomers] = useState([]);
    const [isSelecting, setIsSelecting] = useState(false);

    useEffect(() => {
        const searchCustomers = async () => {
            if (customerSearch.length >= 2 && !isSelecting) {
                try {
                    const response = await api.get(
                        `/cliente/pesquisar?termo=${customerSearch}`
                    );
                    const customersData = response.data;
                    setCustomers(Array.isArray(customersData) ? customersData : []);
                } catch (error) {
                    console.error('Erro ao buscar clientes:', error);
                    setCustomers([]);
                }
            }
        };

        const debounceTimer = setTimeout(searchCustomers, 300);
        return () => clearTimeout(debounceTimer);
    }, [customerSearch, isSelecting]);

    return (
        <div className="payment-field customer-dropdown">
            <label>Cliente</label>
            <input
                type="text"
                value={customerSearch}
                onChange={(e) => {
                    setIsSelecting(false);
                    setCustomerSearch(e.target.value);
                }}
                placeholder="Buscar cliente por nome, CPF, telefone..."
                className="customer-search-input"
            />
            {customers.length > 0 && !isSelecting && (
                <div className="customer-list">
                    {customers.map(customer => (
                        <div
                            key={customer.id}
                            className="customer-item"
                            onClick={() => {
                                setIsSelecting(true);
                                setSelectedCustomer(customer);
                                setCustomerSearch(customer.usuario);
                                setCustomers([]);
                            }}
                        >
                            {customer.usuario}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerSearch;
