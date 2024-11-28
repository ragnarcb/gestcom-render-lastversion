import { useEffect, useState, useCallback } from 'react';

export const useBarCodeReader = (onBarCodeRead) => {
    const [barcodeBuffer, setBarcodeBuffer] = useState('');
    const [lastKeyTime, setLastKeyTime] = useState(Date.now());

    const handleKeyPress = useCallback((event) => {
        const currentTime = Date.now();
        
        // Se for Enter ou Tab, processa o código de barras
        if (event.key === 'Enter' || event.key === 'Tab') {
            event.preventDefault();
            
            // Verifica se o buffer tem um tamanho mínimo para ser um código de barras válido
            if (barcodeBuffer.length >= 8) { // Ajuste esse valor conforme necessário
                onBarCodeRead(barcodeBuffer);
            }
            
            // Limpa o buffer
            setBarcodeBuffer('');
            return;
        }

        // Se passou mais de 50ms desde a última tecla, considera uma nova leitura
        if (currentTime - lastKeyTime > 50) {
            setBarcodeBuffer(event.key);
        } else {
            setBarcodeBuffer(prev => prev + event.key);
        }
        
        setLastKeyTime(currentTime);
    }, [barcodeBuffer, lastKeyTime, onBarCodeRead]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return {
        barcodeBuffer,
        isReading: Date.now() - lastKeyTime < 50
    };
};