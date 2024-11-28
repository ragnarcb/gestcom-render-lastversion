import React from 'react';
import { FiEdit2, FiTrash2, FiDollarSign } from 'react-icons/fi';
import './ActionButtons.css';

const ActionButtons = ({ 
    onEdit, 
    onDelete, 
    onDebt,
    showDelete = true,  // permite controlar quais botões aparecem
    showDebt = true,
    disabled = false    // permite desabilitar todos os botões
}) => {
    return (
        <div className="action-buttons">
            <button 
                className="action-button edit" 
                onClick={onEdit}
                disabled={disabled}
                title="Editar"
                type="button"
            >
                <FiEdit2 />
            </button>

            {showDelete && (
                <button 
                    className="action-button delete" 
                    onClick={onDelete}
                    disabled={disabled}
                    title="Excluir"
                    type="button"
                >
                    <FiTrash2 />
                </button>
            )}

            {showDebt && (
                <button 
                    className="action-button debt" 
                    onClick={onDebt}
                    disabled={disabled}
                    title="Gerenciar Dívida"
                    type="button"
                >
                    <FiDollarSign />
                </button>
            )}
        </div>
    );
};

export default ActionButtons;