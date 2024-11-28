import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import LoadingScreen from '../loading/LoadingScreen';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = authService.getToken();
                if (!token) {
                    setIsAuthenticated(false);
                    toast.error('Sessão expirada. Por favor, faça login novamente.');
                    return;
                }

                const isValid = await authService.isAuthenticated();
                setIsAuthenticated(isValid);
                
                if (!isValid) {
                    toast.error('Sessão expirada. Por favor, faça login novamente.');
                }
            } catch (error) {
                console.error('Erro ao verificar autenticação:', error);
                setIsAuthenticated(false);
                toast.error('Erro ao verificar autenticação');
            }
        };

        checkAuth();
    }, [location.pathname]);

    if (isAuthenticated === null) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;