import React from 'react';
import { useUsers } from "../../hooks/useUsers";
import ProductsHeader from "../../components/layouts/ProductsHeader";
import UsersTable from "../../components/tables/UsersTable";
import CreateUser from "../../components/users/createUser"; // Ajustado o caminho
import "./UsersManagement.css";

const UsersManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState({});
    const { users, loading, error, refetchUsers } = useUsers(searchTerm, activeFilters);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleSort = (groupId, value) => {
        setActiveFilters(prev => ({
            ...prev,
            [groupId]: prev[groupId] === value ? undefined : value
        }));
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        refetchUsers();
    };

    return (
        <div className="users-management-container">
            <h1>Gerenciamento de Usuários</h1>
            
            <div className="content-container">
                <ProductsHeader 
                    searchTerm={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                    onSortChange={handleSort}
                    activeFilters={activeFilters}
                    filterType="users"
                    addButtonText="Adicionar Usuário"
                    onAddClick={() => {
                        setSelectedUser(null);
                        setShowModal(true);
                    }}
                />

                <UsersTable 
                    users={users}
                    loading={loading}
                    error={error}
                    onEdit={handleEdit}
                />

                <CreateUser 
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    userData={selectedUser}
                />
            </div>
        </div>
    );
};

export default UsersManagement; 