import { useState, useEffect } from 'react';
import api from '../services/Api';

export const useUsers = (searchTerm = '', filters = {}) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            let url = '/usuario';
            const params = new URLSearchParams();
            if (searchTerm) params.append('termo', searchTerm);
            
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const queryString = params.toString();
            if (queryString) url += `?${queryString}`;

            const response = await api.get(url);
            setUsers(response.data);
        } catch (err) {
            setError('Erro ao carregar usuários: ' + (err.response?.data?.message || err.message));
            console.error('Erro ao buscar usuários:', err);
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await api.post('/usuario', {
                usuario: userData.nome,
                email: userData.email,
                senha: userData.senha,
                role: userData.role || 'USER'
            });

            await fetchUsers(); // Recarrega a lista após criar
            return response.data;
        } catch (err) {
            setError('Erro ao criar usuário: ' + (err.response?.data?.message || err.message));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (id, userData) => {
        try {
            setLoading(true);
            setError(null);
            
            if (userData.senha) {
                await api.put(`/usuario/${id}/senha`, {
                    id: id,
                    senha: userData.senha
                });
            } else {
                await api.put(`/usuario/${id}`, {
                    id: id,
                    usuario: userData.nome,
                    email: userData.email,
                    role: userData.role
                });
            }

            await fetchUsers(); // Recarrega a lista após atualizar
            return true;
        } catch (err) {
            setError('Erro ao atualizar usuário: ' + (err.response?.data?.message || err.message));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [searchTerm, JSON.stringify(filters)]);

    return {
        users,
        loading,
        error,
        createUser,
        updateUser,
        refetchUsers: fetchUsers
    };
};
