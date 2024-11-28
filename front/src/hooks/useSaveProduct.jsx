import { useState } from 'react';
import api from '../services/Api';

export const useSaveProduct = () => {
    const [loading, setLoading] = useState(false);

    const saveProduct = async (productData) => {
        setLoading(true);
        try {
            console.log('Dados enviados para salvamento:', productData);
            
            const response = await api.post('/produto', productData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            return response.data;
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { saveProduct, loading };
};