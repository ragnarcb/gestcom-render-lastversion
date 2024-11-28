import React, { useContext, useEffect } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const AppearanceSettings = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <div className="settings-section">
            <h2>Aparência</h2>
            <div className="settings-content">
                <div className="setting-item">
                    <span>Modo Escuro</span>
                    <div 
                        className={`slide-button ${theme === 'dark' ? 'active' : ''}`} 
                        onClick={toggleTheme}
                    >
                        <div className={`slider ${theme === 'dark' ? 'active' : ''}`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppearanceSettings;