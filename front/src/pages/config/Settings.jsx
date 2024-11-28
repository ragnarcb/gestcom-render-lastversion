// src/pages/settings/Settings.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layouts/MainLayout';
import Button from '../../components/buttons/Button';
import { authService } from '../../services/AuthService';
import './Settings.css';

const Settings = () => {
    const isAdmin = authService.isAdmin();
    const navigate = useNavigate();

    const handleUserManagement = () => {
        window.open('/users-management', '_blank');
    };

    return (
        <MainLayout>
            <div className="settings">
                <h1>Configurações</h1>
                <div className="settings-container">
                    {isAdmin && (
                        <>
                            <h2>Admin</h2>
                            <Button
                                text="Gerenciar Usuários"
                                onClick={handleUserManagement}
                                backgroundColor="#333"
                                hoverBackgroundColor="#555"
                                width="350px"
                            />
                        </>
                    )}
                    
                    <Link to="/settings/preferences">
                        <Button
                            text="Preferências"
                            backgroundColor="#333"
                            hoverBackgroundColor="#555"
                            width="350px"
                        />
                    </Link>
                </div>
            </div>
        </MainLayout>
    );
};

export default Settings;