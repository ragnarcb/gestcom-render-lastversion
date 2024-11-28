import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './css/Modal.css';

const Modal = ({ 
    isOpen, 
    onClose, 
    children, 
    title,
    showCloseButton = true,
    showFooter = true,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    isConfirmDisabled = false,
    size = 'medium' // small, medium, large
}) => {
    const [animation, setAnimation] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Pequeno delay para iniciar a animação
            setTimeout(() => {
                setAnimation('entering');
                setTimeout(() => {
                    setAnimation('entered');
                }, 300);
            }, 10);
        }
    }, [isOpen]);

    const handleClose = () => {
        setAnimation('exiting');
        setTimeout(() => {
            onClose();
            setAnimation('');
        }, 300);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-container">
            <div
                className={`modal-overlay ${animation}`}
                onClick={handleClose}
            />
            <div
                className={`modal-content ${animation} modal-${size}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="modal-header">
                    {title && <h2>{title}</h2>}
                    {showCloseButton && (
                        <button 
                            className="modal-close-button"
                            onClick={handleClose}
                        >
                            ×
                        </button>
                    )}
                </div>

                <div className="modal-body">
                    {children}
                </div>

                {showFooter && (
                    <div className="modal-footer">
                        <button 
                            className="modal-cancel-button"
                            onClick={handleClose}
                        >
                            {cancelText}
                        </button>
                        <button
                            className="modal-confirm-button"
                            onClick={onConfirm}
                            disabled={isConfirmDisabled}
                        >
                            {confirmText}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    showCloseButton: PropTypes.bool,
    showFooter: PropTypes.bool,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    onConfirm: PropTypes.func,
    isConfirmDisabled: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default Modal;