import { useState, useEffect } from 'react';

export const usePreferences = () => {
    const [preferences, setPreferences] = useState(() => {
        try {
            const savedPreferences = localStorage.getItem('systemPreferences');
            const parsedPreferences = savedPreferences ? JSON.parse(savedPreferences) : {};
            
            return {
                estoqueMinimo: Number(parsedPreferences.estoqueMinimo) || 5,
                limiteVendas: Number(parsedPreferences.limiteVendas) || 5,
                theme: parsedPreferences.theme || 'light'
            };
        } catch (error) {
            console.error('Erro ao carregar preferências:', error);
            return {
                estoqueMinimo: 5,
                limiteVendas: 5,
                theme: 'light'
            };
        }
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', preferences.theme);
    }, [preferences.theme]);

    const updatePreferences = async (newPreferences) => {
        try {
            const validatedPreferences = {
                estoqueMinimo: Number(newPreferences.estoqueMinimo) || 5,
                limiteVendas: Number(newPreferences.limiteVendas) || 5,
                theme: newPreferences.theme || preferences.theme
            };
            
            localStorage.setItem('systemPreferences', JSON.stringify(validatedPreferences));
            setPreferences(validatedPreferences);
            return validatedPreferences;
        } catch (err) {
            console.error('Erro ao atualizar preferências:', err);
            throw err;
        }
    };

    return { 
        preferences, 
        updatePreferences 
    };
};