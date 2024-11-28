import { useState, useEffect } from 'react';
import api from '../services/Api';
import axios from 'axios';

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get('/categoria');
            // Garante que categories seja sempre um array
            const categoriesData = Array.isArray(response.data) ? response.data : [];
            setCategories(categoriesData);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Erro ao carregar categorias:', err);
            setCategories([]); // Garante um array vazio em caso de erro
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        categories,
        loading,
        error,
        refetchCategories: fetchCategories
    };
};