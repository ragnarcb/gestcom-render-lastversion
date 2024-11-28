import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsPreference.css';
import Button from '../../components/buttons/Button';
import MainLayout from '../../components/layouts/MainLayout';
import StockPreferences from '../../components/Settings/StockPreferences';
import AppearanceSettings from '../../components/Settings/AppearanceSettings';
import NotificationSettings from '../../components/Settings/NotificationSettings';
import { ToastContainer, toast } from 'react-toastify';
import { ThemeContext } from '../../context/ThemeContext';

const SettingsPreference = () => {
    const { theme } = useContext(ThemeContext);
    const [notifications, setNotifications] = useState(() => {
        const systemPrefs = localStorage.getItem('systemPreferences');
        return systemPrefs ? JSON.parse(systemPrefs).notifications !== false : true;
    });
    const [hasChanges, setHasChanges] = useState(false);
    const navigate = useNavigate();
    const stockPreferencesRef = useRef();

    useEffect(() => {
        setHasChanges(true);
    }, [notifications]);

    const handleSave = async () => {
        try {
            const saveSuccess = await stockPreferencesRef.current?.handleSave();
            
            const systemPrefs = localStorage.getItem('systemPreferences');
            const preferences = systemPrefs ? JSON.parse(systemPrefs) : {};
            preferences.theme = theme;
            preferences.notifications = notifications;
            localStorage.setItem('systemPreferences', JSON.stringify(preferences));
            
            if (saveSuccess) {
                toast.success('Configurações salvas com sucesso!', {
                    position: "top-right",
                    autoClose: 3000,
                });
                
                setHasChanges(false);
            }
        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
            toast.error('Erro ao salvar configurações', {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return (
        <MainLayout>
            <div className="settings-preference">
                <h1>Preferências do Sistema</h1>
                <div className="settings-preference-grid">
                    <AppearanceSettings />
                    <NotificationSettings 
                        notifications={notifications}
                        onToggle={() => {
                            setNotifications(!notifications);
                            setHasChanges(true);
                        }}
                    />
                    <StockPreferences 
                        ref={stockPreferencesRef} 
                        onChange={() => setHasChanges(true)}
                    />
                </div>

                <div className="settings-actions">
                    <Button
                        text="Voltar"
                        onClick={() => navigate(-1)}
                        backgroundColor="#333"
                        hoverBackgroundColor="#555"
                        width="150px"
                    />
                    <Button
                        text="Salvar Alterações"
                        onClick={handleSave}
                        disabled={!hasChanges}
                        backgroundColor="#4CAF50"
                        hoverBackgroundColor="#45a049"
                        width="150px"
                    />
                </div>
            </div>
           
        </MainLayout>
    );
};

export default SettingsPreference; 