import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import { authService } from '../../services/AuthService';
import './UsersManagement.css';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                // Implementar lógica de busca de usuários
                const response = await authService.getUsers();
                setUsers(response.data);
            } catch (err) {
                setError('Erro ao carregar usuários');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <MainLayout>
            <div className="users-management">
                <h1>Gerenciamento de Usuários</h1>
                
                {loading && <p>Carregando...</p>}
                {error && <p className="error">{error}</p>}
                
                {!loading && !error && (
                    <div className="users-list">
                        {users.map(user => (
                            <div key={user.id} className="user-card">
                                <h3>{user.name}</h3>
                                <p>Email: {user.email}</p>
                                <p>Papel: {user.role}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default UsersManagement; 