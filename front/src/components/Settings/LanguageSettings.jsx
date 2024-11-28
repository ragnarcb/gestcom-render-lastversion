import React from 'react';

const LanguageSettings = ({ language, onLanguageChange }) => {
    return (
        <div className="settings-section">
            <h2>Idioma</h2>
            <div className="settings-content">
                <div className="setting-item">
                    <span>Idioma do Sistema</span>
                    <select
                        value={language}
                        onChange={onLanguageChange}
                        className="language-select"
                    >
                        <option value="pt">Português</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default LanguageSettings;