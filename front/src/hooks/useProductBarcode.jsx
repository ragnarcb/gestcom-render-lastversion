import { useState } from 'react';
import api from '../services/Api';

export const useProductBarcode = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchBarcode = async (barcode, onExistingProduct, onNewProduct) => {
        if (!barcode?.trim()) {
            setError('Código de barras inválido');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Primeiro tenta buscar no banco local
            const localResponse = await api.get(`/produto/buscar-codigo-barras/${barcode}`, {
                timeout: 5000 // 5 segundos de timeout
            });
            
            if (localResponse.status === 200 && localResponse.data) {
                console.log('Produto encontrado no banco local:', localResponse.data);
                onExistingProduct && onExistingProduct(localResponse.data);
                return;
            }
        } catch (localError) {
            if (localError.code === 'ERR_NETWORK') {
                setError('Erro de conexão com o servidor. Verifique sua conexão ou tente novamente mais tarde.');
                setLoading(false);
                return;
            }

            if (localError.response?.status !== 404) {
                console.error('Erro na busca local:', localError);
            }

            try {
                // Se não encontrou localmente, tenta na API externa
                console.log('Iniciando busca na API externa para código:', barcode);
                const externalResponse = await api.get(`/produto/codigo-barras/${barcode}`, {
                    timeout: 8000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (externalResponse.status === 200 && externalResponse.data) {
                    const productData = externalResponse.data;
                    
                    const formattedProduct = {
                        nome: productData.description || productData.nome || '',
                        descricao: productData.full_description || productData.descricao || productData.description || '',
                        preco: Number(productData.preco || productData.avg_price || 0).toFixed(2),
                        quantidade: Number(productData.quantidade || 0),
                        categoryId: productData.categoryId || '',
                        codigoBarras: barcode,
                        imagem: productData.thumbnail || productData.imagem || null
                    };
                    
                    console.log('Produto formatado:', formattedProduct);
                    onNewProduct && onNewProduct(formattedProduct);
                }
            } catch (externalError) {
                console.error('Erro completo na API externa:', {
                    message: externalError.message,
                    status: externalError.response?.status,
                    data: externalError.response?.data,
                    config: externalError.config,
                    originalError: externalError
                });
                
                let errorMessage = 'Erro ao buscar produto';
                
                if (typeof externalError.response?.data === 'string') {
                    errorMessage = externalError.response.data;
                } else if (externalError.response?.data?.message) {
                    errorMessage = externalError.response.data.message;
                } else if (externalError.code === 'ERR_NETWORK') {
                    errorMessage = 'Erro de conexão com o servidor. Verifique sua conexão ou tente novamente mais tarde.';
                }
                
                setError(errorMessage);
                return;
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        searchBarcode,
        loading,
        error
    };
};