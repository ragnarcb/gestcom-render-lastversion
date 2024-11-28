import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useProductBarcode } from '../../hooks/useProductBarcode';
import { useBarCodeReader } from '../../hooks/useBarCodeReader';
import './BarcodeInput.css';

const BarcodeInput = ({ onExistingProduct, onNewProduct, value, onChange }) => {
    const [barcode, setBarcode] = useState(value || '');
    const { searchBarcode, loading, error } = useProductBarcode();
    const [isReaderInput, setIsReaderInput] = useState(false);
    const searchTimeoutRef = useRef(null);

    useEffect(() => {
        setBarcode(value || '');
    }, [value]);

    const handleSearch = async (barcodeValue) => {
        if (!barcodeValue?.trim()) return;
        
        try {
            console.log('Iniciando busca para:', barcodeValue);
            await searchBarcode(
                barcodeValue,
                (product) => {
                    console.log('Produto existente encontrado:', product);
                    onExistingProduct && onExistingProduct(product);
                },
                (product) => {
                    console.log('Novo produto para cadastro:', product);
                    onNewProduct && onNewProduct(product);
                }
            );
        } catch (err) {
            console.error('Erro ao buscar código de barras:', err);
        }
    };

    const handleBarCodeRead = (scannedBarcode) => {
        if (scannedBarcode && scannedBarcode.length >= 8) {
            console.log('Código lido pelo leitor:', scannedBarcode);
            setBarcode(scannedBarcode);
            setIsReaderInput(true);
        }
    };

    useBarCodeReader(handleBarCodeRead);

    useEffect(() => {
        if (isReaderInput && barcode) {
            // Limpa timeout anterior se existir
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }

            // Adiciona pequeno delay para garantir que o código completo foi lido
            searchTimeoutRef.current = setTimeout(() => {
                console.log('Processando código do leitor:', barcode);
                handleSearch(barcode);
                setIsReaderInput(false);
            }, 100);
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [barcode, isReaderInput]);

    const handleManualInput = (e) => {
        const newValue = e.target.value;
        setBarcode(newValue);
        setIsReaderInput(false);
        onChange && onChange({
            target: {
                name: 'codigoBarras',
                value: newValue
            }
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isReaderInput) {
            handleSearch(barcode);
        }
    };

    return (
        <div className="form-group">
            <label>Código de Barras</label>
            <div className="barcode-input-container">
                <input
                    type="text"
                    value={barcode}
                    onChange={handleManualInput}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite ou use um leitor de código de barras"
                    className={`barcode-input ${error ? 'error' : ''}`}
                    disabled={loading}
                />
                <button 
                    className="search-barcode-button"
                    type="button"
                    onClick={() => handleSearch(barcode)}
                    disabled={loading}
                    title="Buscar código de barras"
                >
                    <FontAwesomeIcon 
                        icon={loading ? faSpinner : faSearch} 
                        spin={loading}
                    />
                </button>
            </div>
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
        </div>
    );
};

export default BarcodeInput;