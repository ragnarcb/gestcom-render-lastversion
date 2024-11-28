import { useState, useEffect, useMemo } from 'react';
import api from '../services/Api';


const normalizeString = (str = '') => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
};

export const useCustomers = (searchTerm = '', activeFilters = {}) => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/cliente');
            setCustomers(response.data);
            setError(null);
        } catch (err) {
            console.error('Erro ao buscar clientes:', err);
            setError('Erro ao carregar os clientes');
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    // Carrega os clientes quando o componente monta
    useEffect(() => {
        fetchCustomers();
    }, []);

    const sortedAndFilteredCustomers = useMemo(() => {
        let result = [...customers];

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase().trim();
            result = result.filter(customer => 
                customer.usuario?.toLowerCase().includes(searchLower) ||
                customer.email?.toLowerCase().includes(searchLower)
            );
        }

        // Aplica os filtros
        if (activeFilters.name) {
            const isAsc = activeFilters.name === 'nameAsc';
            result.sort((a, b) => {
                const nameA = normalizeString(a.usuario || '');
                const nameB = normalizeString(b.usuario || '');
                return isAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            });
        }

        if (activeFilters.debt) {
            const isAsc = activeFilters.debt === 'debtAsc';
            result.sort((a, b) => isAsc ? 
                (a.valorDevedor || 0) - (b.valorDevedor || 0) : 
                (b.valorDevedor || 0) - (a.valorDevedor || 0)
            );
        }

        if (activeFilters.lastPurchase) {
            const isAsc = activeFilters.lastPurchase === 'lastPurchaseAsc';
            result.sort((a, b) => {
                const dateA = new Date(a.ultimaCompra || 0);
                const dateB = new Date(b.ultimaCompra || 0);
                return isAsc ? dateA - dateB : dateB - dateA;
            });
        }

        return result;
    }, [customers, searchTerm, activeFilters]);

    return {
        customers: sortedAndFilteredCustomers,
        loading,
        error,
        refetchCustomers: fetchCustomers
    };
};