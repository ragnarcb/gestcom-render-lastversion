import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        try {
            const systemPrefs = localStorage.getItem('systemPreferences');
            if (systemPrefs) {
                const preferences = JSON.parse(systemPrefs);
                if (preferences.theme) {
                    return preferences.theme;
                }
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } catch (error) {
            console.error('Erro ao carregar tema:', error);
            return 'light';
        }
    });

    useEffect(() => {
        document.body.className = theme === 'light' ? 'light-theme' : 'dark-theme';
    }, [theme]);

    const toggleTheme = () => {
        try {
            const newTheme = theme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        } catch (error) {
            console.error('Erro ao alternar tema:', error);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}; 