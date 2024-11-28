import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import api from '../services/Api';
import { toast } from 'react-toastify';
import { usePreferences } from '../hooks/usePreferences';


const normalizeString = (str) => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .trim();
};

export const useProducts = (searchTerm = '', activeFilters = {}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { preferences } = usePreferences();
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const checkLowStock = useCallback((products) => {
        // Verifica se as notificações estão ativas
        const systemPrefs = localStorage.getItem('systemPreferences');
        const notificationsEnabled = systemPrefs ? JSON.parse(systemPrefs).notifications !== false : true;
        
        if (!notificationsEnabled) return;

        // Verifica se as notificações já foram mostradas
        const notificationsShown = localStorage.getItem('stockNotificationsShown') === 'true';
        if (notificationsShown) return;
        
        const lowStockProducts = products.filter(product => {
            return product.quantidade <= (product.estoqueMinimo || preferences.estoqueMinimo);
        });

        if (lowStockProducts.length === 0) return;

        // Ordenar produtos: primeiro os sem estoque, depois os com estoque baixo
        lowStockProducts.sort((a, b) => {
            if (a.quantidade === 0 && b.quantidade > 0) return -1;
            if (b.quantidade === 0 && a.quantidade > 0) return 1;
            return 0;
        });

        // Limitar a 2 notificações no total
        const notificationsToShow = lowStockProducts.slice(0, 2);
        
        notificationsToShow.forEach(product => {
            if (product.quantidade <= 0) {
                toast.error(`Atenção: Produto "${product.nome}" está sem estoque!`, {
                    toastId: `stock-${product.id}`,
                    position: "top-right",
                    autoClose: 5000,
                });
            } else {
                toast.warning(
                    `Atenção: Produto "${product.nome}" está com estoque baixo! (${product.quantidade} unidades)`,
                    {
                        toastId: `stock-${product.id}`,
                        position: "top-right",
                        autoClose: 5000,
                    }
                );
            }
        });

        // Se houver mais produtos com problemas de estoque
        if (lowStockProducts.length > 2) {
            setTimeout(() => {
                toast.info(
                    `Existem mais ${lowStockProducts.length - 2} produtos com problemas de estoque. Acesse a aba Produtos e filtre por estoque para visualizar todos.`,
                    {
                        toastId: 'more-stock-issues',
                        position: "top-right",
                        autoClose: 7000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    }
                );
            }, 1000);
        }
        
        // Marca as notificações como mostradas
        localStorage.setItem('stockNotificationsShown', 'true');
    }, [preferences.estoqueMinimo]);

    useEffect(() => {
        const handleResetNotifications = () => {
            // Remove a marca de notificações mostradas
            localStorage.removeItem('stockNotificationsShown');
            if (products.length > 0) {
                checkLowStock(products);
            }
        };

        window.addEventListener('resetStockNotifications', handleResetNotifications);

        return () => {
            window.removeEventListener('resetStockNotifications', handleResetNotifications);
        };
    }, [products, checkLowStock]);

    const fetchProducts = async () => {
        if (!mounted.current) return;
        setLoading(true);
        try {
            const response = await api.get('/produto');
            if (mounted.current) {
                // Garante que os dados são um array e que cada produto tem um ID
                const validProducts = Array.isArray(response.data) 
                    ? response.data.filter(product => product && product.id)
                    : [];
                setProducts(validProducts);
                setError(null);
                
                // Se tiver produtos, verifica o estoque
                if (validProducts.length > 0) {
                    checkLowStock(validProducts);
                }
            }
        } catch (err) {
            if (mounted.current) {
                console.error('Erro ao carregar produtos:', err);
                setError('Erro ao carregar produtos');
                setProducts([]);
            }
        } finally {
            if (mounted.current) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const handleStockUpdate = () => {
            fetchProducts();
        };

        window.addEventListener('updateStock', handleStockUpdate);

        return () => {
            window.removeEventListener('updateStock', handleStockUpdate);
        };
    }, []);

    const sortedAndFilteredProducts = useMemo(() => {
        let result = [...products];

        // Aplica a busca
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase().trim();
            result = result.filter(product => 
                product.nome?.toLowerCase().includes(searchLower) ||
                product.descricao?.toLowerCase().includes(searchLower) ||
                product.codigoBarras?.includes(searchTerm)
            );
        }

        // Aplica os filtros em ordem
        if (activeFilters.name) {
            const isAsc = activeFilters.name === 'nameAsc';
            result.sort((a, b) => {
                const nameA = normalizeString(a.nome || '');
                const nameB = normalizeString(b.nome || '');
                return isAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            });
        }

        if (activeFilters.price) {
            const isAsc = activeFilters.price === 'priceAsc';
            result.sort((a, b) => isAsc ? (a.preco || 0) - (b.preco || 0) : (b.preco || 0) - (a.preco || 0));
        }

        if (activeFilters.stock) {
            const isAsc = activeFilters.stock === 'stockAsc';
            result.sort((a, b) => isAsc ? (a.quantidade || 0) - (b.quantidade || 0) : (b.quantidade || 0) - (a.quantidade || 0));
        }

        return result;
    }, [products, searchTerm, activeFilters]);

    return {
        products: sortedAndFilteredProducts,
        loading,
        error,
        refetchProducts: fetchProducts
    };
};