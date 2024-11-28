import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { usePreferences } from '../../hooks/usePreferences';
import CustomInput from '../input/custom/CustomInput';
import { toast } from 'react-toastify';
import './StockPreferences.css';

const StockPreferences = forwardRef((props, ref) => {
    const { preferences, updatePreferences } = usePreferences();
    const [stockLimit, setStockLimit] = useState(preferences.estoqueMinimo);
    const [salesLimit, setSalesLimit] = useState(preferences.limiteVendas);

    useEffect(() => {
        setStockLimit(preferences.estoqueMinimo);
        setSalesLimit(preferences.limiteVendas);
    }, [preferences]);

    const handleStockChange = (e) => {
        const value = e.target.value === '' ? '' : parseInt(e.target.value);
        setStockLimit(value);
        if (props.onChange) props.onChange();
    };

    const handleSalesChange = (e) => {
        const value = e.target.value === '' ? '' : parseInt(e.target.value);
        setSalesLimit(value);
        if (props.onChange) props.onChange();
    };

    useImperativeHandle(ref, () => ({
        handleSave: async () => {
            try {
                if (!stockLimit || stockLimit <= 0) {
                    toast.error('O limite mínimo de estoque deve ser maior que zero!', {
                        position: "top-right",
                        autoClose: 3000
                    });
                    return false;
                }

                if (!salesLimit || salesLimit <= 0) {
                    toast.error('O limite de vendas para notificação deve ser maior que zero!', {
                        position: "top-right",
                        autoClose: 3000
                    });
                    return false;
                }

                const validatedStockLimit = Math.max(1, Number(stockLimit));
                const validatedSalesLimit = Math.max(1, Number(salesLimit));
                
                await updatePreferences({
                    ...preferences,
                    estoqueMinimo: validatedStockLimit,
                    limiteVendas: validatedSalesLimit
                });

                window.dispatchEvent(new CustomEvent('updateStockPreferences'));
                window.dispatchEvent(new CustomEvent('updateSalesLimit', { 
                    detail: { limit: validatedSalesLimit } 
                }));

                return true;
            } catch (error) {
                console.error('Erro ao salvar preferências:', error);
                toast.error('Erro ao salvar preferências', {
                    position: "top-right",
                    autoClose: 3000
                });
                return false;
            }
        }
    }));

    return (
        <div className="settings-section">
            <div className="settings-section__header">
                <h2>Configurações de Estoque</h2>
                <p className="settings-section__description">
                    Define os limites do sistema
                </p>
            </div>
            
            <div className="settings-section__content">
                <div className="settings-section__input-group">
                    <CustomInput
                        label="Limite Mínimo de Estoque"
                        type="number"
                        value={stockLimit}
                        onChange={handleStockChange}
                        min="1"
                        required
                    />
                    <span className="settings-section__helper-text">
                        Você receberá notificações quando o estoque atingir este valor
                    </span>
                </div>

                <div className="settings-section__input-group">
                    <CustomInput
                        label="Limite de Vendas para Notificação"
                        type="number"
                        value={salesLimit}
                        onChange={handleSalesChange}
                        min="1"
                        required
                    />
                    <span className="settings-section__helper-text">
                        Quantidade de vendas para receber notificação de parabéns
                    </span>
                </div>
            </div>
        </div>
    );
});

export default StockPreferences;