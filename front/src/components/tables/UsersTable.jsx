import React from 'react';
import './UsersTable.css';

const UsersTable = ({ 
    users = [], 
    loading = false, 
    error = null,
    onEdit
}) => {
    if (loading) return <p className="table-message">Carregando...</p>;
    if (error) return <p className="table-message error">{error}</p>;
    if (!users.length) return <p className="table-message">Nenhum usuário encontrado.</p>;

    const getRoleDisplay = (role) => {
        const roles = {
            'ADMIN': 'Administrador',
            'USER': 'Usuário'
        };
        return roles[role] || role;
    };

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Tipo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.usuario}</td>
                            <td>{user.email}</td>
                            <td>{getRoleDisplay(user.role)}</td>
                            <td>
                                <div className="action-buttons">
                                    <button 
                                        className="edit-button"
                                        onClick={() => onEdit?.(user)}
                                    >
                                        Editar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable; 