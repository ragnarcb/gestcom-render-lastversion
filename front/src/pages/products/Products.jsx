import React, { useState, useCallback } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import CustomAlert from '../../components/alert/CustomAlert';
import ProductGrid from '../../components/ItensConponent/ProductGrid';
import ProductsHeader from '../../components/layouts/ProductsHeader';
import ProductFormModal from '../../components/modal/ProductFormModal';
import { useProducts } from '../../hooks/useProducts';
import './Products.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePreferences } from '../../hooks/usePreferences';

const Products = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const { products, loading, error, refetchProducts } = useProducts(searchTerm, activeFilters);
    const { preferences } = usePreferences();

    const handleProductSaved = () => {
        refetchProducts();
        setIsModalOpen(false);
        setEditingProduct(null);
        toast.success('Produto salvo com sucesso!', {
            position: "top-right",
            autoClose: 3000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    };

    const handleSaveError = (error) => {
        let mensagemErro = 'Erro ao salvar produto';
        
        if (error.response?.data?.message) {
            mensagemErro = error.response.data.message;
        } else if (error.message) {
            mensagemErro = error.message;
        }
        
        toast.error(mensagemErro, {
            position: "top-right",
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await api.delete(`/produtos/${productId}`);
            refetchProducts();
            toast.success('Produto excluído com sucesso!', {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } catch (error) {
            let mensagemErro = 'Erro ao excluir produto';
            
            if (error.response?.data?.message) {
                mensagemErro = error.response.data.message;
            }
            
            toast.error(mensagemErro, {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        console.log('Termo de busca atualizado:', value); // Debug
        setSearchTerm(value);
    };

    const handleSort = (groupId, value) => {
        console.log('Aplicando filtro:', groupId, value); // Debug
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            if (newFilters[groupId] === value) {
                delete newFilters[groupId];
            } else {
                newFilters[groupId] = value;
            }
            console.log('Novos filtros:', newFilters); // Debug
            return newFilters;
        });
    };

    const checkLowStock = useCallback((products) => {
        products.forEach(product => {
            const stockLimit = preferences.estoqueMinimo;
            if (product.quantidade <= stockLimit && product.quantidade > 0) {
                toast.warning(
                    `Atenção: Produto "${product.nome}" está com estoque baixo! (${product.quantidade} unidades)`,
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    }
                );
            } else if (product.quantidade <= 0) {
                toast.error(
                    `Atenção: Produto "${product.nome}" está sem estoque!`,
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    }
                );
            }
        });
    }, []);

    window.openEditModal = openEditModal;

    return (
        <MainLayout>
            <div className="products">
                <h1>Gestão de Produtos</h1>
                
                <ProductsHeader 
                    searchTerm={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                    onSortChange={handleSort}
                    activeFilters={activeFilters}
                    onAddClick={() => setIsModalOpen(true)}
                />

                <ProductFormModal 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onProductSaved={handleProductSaved}
                    onError={handleSaveError}
                    editingProduct={editingProduct}
                />

                <div className="products-container">
                    <h2>Produtos Disponíveis</h2>
                    <ProductGrid
                        products={products}
                        loading={loading}
                        error={error}
                        onButtonClick={handleEditProduct}
                        buttonText="Editar Produto"
                    />
                </div>

                <CustomAlert />
            </div>
        </MainLayout>
    );
};

export default Products;
