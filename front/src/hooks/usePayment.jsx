import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/Api';
import { usePreferences } from './usePreferences';


export const usePayment = (cart, onSaleSuccess) => {
    const { preferences } = usePreferences();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    
    const [salesCounter, setSalesCounter] = useState(() => {
        return parseInt(localStorage.getItem('salesCounter') || '0');
    });

    useEffect(() => {
        localStorage.setItem('salesCounter', salesCounter.toString());
    }, [salesCounter]);

    const handleFinishSale = async () => {
        try {
            if (!selectedPayment) {
                toast.error('Selecione uma forma de pagamento');
                return;
            }

            if (selectedPayment === 'credit' && !selectedCustomer) {
                toast.error('Selecione um cliente para registro do fiado');
                return;
            }

            const totalVenda = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const itensVenda = cart.map(item => ({
                produto: { id: item.id },
                quantidade: item.quantity,
                precoUnitario: item.price,
                totalByProduto: item.price * item.quantity
            }));

            const formaPagamento = {
                'card': 'CARTAO',
                'money': 'DINHEIRO',
                'credit': 'FIADO'
            }[selectedPayment];

            if (selectedPayment === 'credit') {
                await api.post(`/cliente/${selectedCustomer.id}/adicionar-divida`, {
                    valor: totalVenda
                });
            }

            const vendaResponse = await api.post('/venda', {
                itens: itensVenda,
                total: totalVenda,
                formaPagamento: formaPagamento,
                clienteId: selectedPayment === 'credit' ? selectedCustomer.id : null,
                statusFechado: true
            });

            const mensagensSucesso = {
                'card': 'Venda no cartão realizada com sucesso!',
                'money': 'Venda em dinheiro realizada com sucesso!',
                'credit': selectedCustomer ? `Fiado registrado com sucesso para ${selectedCustomer.usuario}!` : 'Venda fiada realizada com sucesso!'
            };

            toast.success(mensagensSucesso[selectedPayment], {
                position: "top-right",
                autoClose: 3000,
            });

            const newCounter = salesCounter + 1;
            
            if (newCounter >= preferences.limiteVendas) {
                setSalesCounter(0);
                const event = new CustomEvent('resetStockNotifications');
                window.dispatchEvent(event);
            } else {
                setSalesCounter(newCounter);
            }

            const updateStockEvent = new CustomEvent('updateStock', {
                detail: { items: itensVenda }
            });
            window.dispatchEvent(updateStockEvent);

            if (typeof onSaleSuccess === 'function') {
                onSaleSuccess();
            }

            handleClosePaymentModal();
            
        } catch (error) {
            console.error('Erro ao finalizar venda:', error);
            
            if (error.response?.status === 403) {
                const errorMessage = error.response?.data?.message;
                if (errorMessage?.includes('estoque') || errorMessage?.includes('quantidade')) {
                    toast.error('Quantidade em estoque insuficiente para realizar a venda. Por favor, verifique o estoque disponível.');
                    return;
                }
            }

            const mensagensErro = {
                'card': 'Erro ao processar pagamento no cartão',
                'money': 'Erro ao registrar pagamento em dinheiro',
                'credit': 'Erro ao registrar venda fiada'
            };
            
            const errorMessage = mensagensErro[selectedPayment] || 'Erro ao finalizar venda';
            toast.error(`${errorMessage}. ${error.response?.data?.message || 'Por favor, tente novamente.'}`);
        }
    };

    const handleOpenPaymentModal = useCallback(() => {
        setSelectedPayment('card');
        setShowPaymentModal(true);
    }, []);

    const handleClosePaymentModal = useCallback(() => {
        setShowPaymentModal(false);
        setSelectedPayment(null);
        setSelectedCustomer(null);
    }, []);

    return {
        showPaymentModal,
        selectedPayment,
        selectedCustomer,
        setSelectedCustomer,
        setSelectedPayment,
        handleOpenPaymentModal,
        handleClosePaymentModal,
        handleFinishSale
    };
};