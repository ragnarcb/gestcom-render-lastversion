import { useState } from 'react';
import api from '../services/Api';

export const useUpdateProduct = () => {
    const [loading, setLoading] = useState(false);

    const updateProduct = async (productData) => {
        try {
            setLoading(true);
            console.log('Dados enviados para atualização:', productData);

            const response = await api.put('/produto', productData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Erro na atualização:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { updateProduct, loading };
};