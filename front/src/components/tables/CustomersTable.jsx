import React from 'react';
import ActionButtons from '../buttons/ActionButtons';
import './CustomersTable.css';

const CustomersTable = ({ 
    customers = [], 
    loading = false, 
    error = null,
    onEdit,
    onDebt
}) => {
    if (loading) return <p className="table-message">Carregando...</p>;
    if (error) return <p className="table-message error">{error}</p>;
    if (!customers.length) return <p className="table-message">Nenhum cliente encontrado.</p>;

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>CEP</th>
                        <th>Dívida</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(customer => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.usuario}</td>
                            <td>{customer.email}</td>
                            <td>{customer.telefone}</td>
                            <td>{customer.cep}</td>
                            <td className={`debt-value ${customer.valorDevedor > 0 ? 'has-debt' : ''}`}>
                                R$ {customer.valorDevedor?.toFixed(2)}
                            </td>
                            <td>
                                <ActionButtons 
                                    onEdit={() => onEdit?.(customer)}
                                    onDebt={() => onDebt?.(customer)}
                                    showDelete={false}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomersTable;