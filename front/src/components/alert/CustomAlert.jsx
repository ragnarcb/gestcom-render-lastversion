import React from 'react';
import './CustomAlert.css';

const CustomAlert = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message 
}) => {
    if (!isOpen) return null;

    return (
        <div className="custom-alert-overlay">
            <div className="custom-alert-container">
                <div className="custom-alert-header">
                    <h3>{title}</h3>
                </div>
                <div className="custom-alert-content">
                    <p>{message}</p>
                </div>
                <div className="custom-alert-actions">
                    <button 
                        className="custom-alert-button cancel" 
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="custom-alert-button confirm" 
                        onClick={onConfirm}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomAlert;
