import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../services/Api';
import './css/DebtModal.css';

const DebtModal = ({ show, onClose, customer, onSuccess }) => {
    const [modalAnimation, setModalAnimation] = useState('');
    const [debtAmount, setDebtAmount] = useState('');

    useEffect(() => {
        if (show) {
            setModalAnimation('entering');
            setTimeout(() => {
                setModalAnimation('entered');
            }, 300);
        }
    }, [show]);

    const handleClose = () => {
        setModalAnimation('exiting');
        setTimeout(() => {
            onClose();
            setModalAnimation('');
            setDebtAmount('');
        }, 300);
    };

    const handlePayDebt = async () => {
        try {
            const newDebtValue = customer.valorDevedor - parseFloat(debtAmount);
            
            if (newDebtValue < 0) {
                toast.error('O valor do pagamento não pode ser maior que a dívida atual');
                return;
            }

            await api.post(`/cliente/${customer.id}/abater-divida`, {
                valor: parseFloat(debtAmount)
            });
            
            toast.success('Pagamento registrado com sucesso!');
            onSuccess?.();
            handleClose();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao registrar pagamento';
            toast.error(errorMessage);
            console.error('Erro:', error);
        }
    };

    const handleAddDebt = async () => {
        try {
            await api.post(`/cliente/${customer.id}/adicionar-divida`, {
                valor: parseFloat(debtAmount)
            });
            
            toast.success('Dívida adicionada com sucesso!');
            onSuccess?.();
            handleClose();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao adicionar dívida';
            toast.error(errorMessage);
            console.error('Erro:', error);
        }
    };

    if (!show) return null;

    return (
        <div className="modal-container">
            <div 
                className={`modal-overlay ${modalAnimation}`} 
                onClick={handleClose} 
            />
            <div className={`modal-content debt-modal ${modalAnimation}`}>
                <button className="close-button" onClick={handleClose}>
                    <FiX />
                </button>
                
                <h2>Gerenciar Dívida</h2>
                
                <div className="debt-info">
                    <p>Cliente: {customer?.usuario}</p>
                    <p>Dívida Atual: R$ {customer?.valorDevedor?.toFixed(2)}</p>
                </div>

                <div className="form-group">
                    <label>Valor</label>
                    <input
                        type="number"
                        value={debtAmount}
                        onChange={(e) => setDebtAmount(e.target.value)}
                        placeholder="Digite o valor"
                        step="0.01"
                        min="0"
                    />
                </div>

                <div className="debt-buttons">
                    <button 
                        className="debt-button add-debt"
                        onClick={handleAddDebt}
                        disabled={!debtAmount || debtAmount <= 0}
                    >
                        Adicionar Dívida
                    </button>
                    <button 
                        className="debt-button pay-debt"
                        onClick={handlePayDebt}
                        disabled={!debtAmount || debtAmount <= 0}
                    >
                        Registrar Pagamento
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DebtModal;