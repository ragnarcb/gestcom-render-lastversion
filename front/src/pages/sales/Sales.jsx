// src/pages/sales/Sales.jsx
import React, { useState, useCallback } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchInput from '../../components/input/SearchInput';
import ShoppingCart from '../../components/cart/ShoppingCart';
import PaymentContent from '../../components/Payment/PaymentContent';
import ProductGrid from '../../components/ItensConponent/ProductGrid';
import PaymentOptions from '../../components/Payment/paymentOptions/PaymentOptions';
import Modal from '../../components/modal/Modal';
import { useCart } from '../../hooks/useCart';
import { useProducts } from '../../hooks/useProducts';
import { usePayment } from '../../hooks/usePayment';
import { useBarCodeReader } from '../../hooks/useBarCodeReader';
import './Sales.css';
import { BiSortAZ, BiSortZA, BiSortUp, BiSortDown } from 'react-icons/bi';

const Sales = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});

    const { cart, addToCart, removeFromCart, decreaseQuantity, clearCart } = useCart();
    const { products, loading, error, refreshProducts } = useProducts(searchTerm, activeFilters);

    // Criar callback para lidar com o sucesso da venda
    const handleSaleSuccess = useCallback(() => {
        clearCart();
        if (refreshProducts) {
            refreshProducts();
        }
    }, [clearCart, refreshProducts]);

    const { 
        showPaymentModal,
        selectedPayment,
        selectedCustomer,
        setSelectedCustomer,
        setSelectedPayment,
        handleOpenPaymentModal,
        handleClosePaymentModal,
        handleFinishSale
    } = usePayment(cart, handleSaleSuccess);

    // Callback para processar o código de barras lido
    const handleBarCodeRead = useCallback((barcode) => {
        const product = products.find(p => p.codigoBarras === barcode);
        if (product) {
            addToCart(product);
        }
    }, [products, addToCart]);

    // Usar o hook do leitor de código de barras
    useBarCodeReader(handleBarCodeRead);

    const filterOptions = [
        {
            id: 'name',
            title: 'Nome',
            options: [
                { value: 'nameAsc', icon: <BiSortAZ />, label: 'Nome (A-Z)' },
                { value: 'nameDesc', icon: <BiSortZA />, label: 'Nome (Z-A)' }
            ]
        },
        {
            id: 'price',
            title: 'Preço',
            options: [
                { value: 'priceAsc', icon: <BiSortUp />, label: 'Menor Preço' },
                { value: 'priceDesc', icon: <BiSortDown />, label: 'Maior Preço' }
            ]
        }
    ];

    const handleSort = (groupId, value) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            if (newFilters[groupId] === value) {
                delete newFilters[groupId];
            } else {
                newFilters[groupId] = value;
            }
            return newFilters;
        });
    };

    return (
        <MainLayout>
 
            <div className="sales">
                <h1>Controle de Vendas</h1>

                <div className="sales-controls">
                    <SearchInput
                        placeholder="Pesquisar produtos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onSortChange={handleSort}
                        activeFilters={activeFilters}
                        filterType="products"
                    />
                    <button
                        className="finish-sale-button"
                        onClick={handleOpenPaymentModal}
                        disabled={cart.length === 0}
                    >
                        Finalizar Venda
                    </button>
                </div>

                <ShoppingCart 
                    cart={cart}
                    removeFromCart={removeFromCart}
                    addToCart={addToCart}
                    decreaseQuantity={decreaseQuantity}
                />

                <div className="sales-content-wrapper">
                    <div className="product-section">
                        <div className="product-list">
                            <h2>Produtos Disponíveis</h2>
                            <ProductGrid
                                products={products}
                                loading={loading}
                                error={error}
                                onButtonClick={addToCart}
                                buttonText="Adicionar ao Carrinho"
                                showButton={true}
                            />
                        </div>
                    </div>
                </div>

                <Modal
                    isOpen={showPaymentModal}
                    onClose={handleClosePaymentModal}
                    title="Forma de Pagamento"
                    onConfirm={handleFinishSale}
                    isConfirmDisabled={!selectedPayment}
                    size="medium"
                >
                    <PaymentOptions 
                        selectedPayment={selectedPayment}
                        onSelectPayment={setSelectedPayment}
                    />
                    <PaymentContent
                        selectedPayment={selectedPayment}
                        total={cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                        cart={cart}
                        onClose={handleClosePaymentModal}
                        selectedCustomer={selectedCustomer}
                        setSelectedCustomer={setSelectedCustomer}
                    />
                </Modal>
            </div>
        </MainLayout>
    );
};

export default Sales;