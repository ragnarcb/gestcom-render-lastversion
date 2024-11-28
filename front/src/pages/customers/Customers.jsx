import React, { useState } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import { FiEdit2, FiTrash2, FiDollarSign } from 'react-icons/fi';
import './Customers.css';
import { toast } from 'react-toastify';
import { useCustomers } from '../../hooks/useCustomers';
import ProductsHeader from '../../components/layouts/ProductsHeader';
import CustomerModal from '../../components/modal/CustomerModal';
import DebtModal from '../../components/modal/DebtModal';
import CustomersTable from '../../components/tables/CustomersTable';

const Customers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState({});
    const { customers, loading, error, refetchCustomers } = useCustomers(searchTerm, activeFilters);
    const [showModal, setShowModal] = useState(false);
    const [showDebtModal, setShowDebtModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const handleSort = (groupId, value) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            if (newFilters[groupId] === value) {
                delete newFilters[groupId];
            } else {
                newFilters[groupId] = value;
            }
            return newFilters;
        });
    };

    const handleEdit = (customer) => {
        setSelectedCustomer(customer);
        setShowModal(true);
    };

    const handleOpenDebtModal = (customer) => {
        setSelectedCustomer(customer);
        setShowDebtModal(true);
    };

    return (
        <MainLayout>
            <div className="customers-container">
                <h1>Gestão de Clientes</h1>
                
                <div className="content-container">
                    <ProductsHeader 
                        searchTerm={searchTerm}
                        onSearchChange={(e) => setSearchTerm(e.target.value)}
                        onSortChange={handleSort}
                        activeFilters={activeFilters}
                        filterType="customers"
                        onAddClick={() => {
                            setSelectedCustomer(null);
                            setShowModal(true);
                        }}
                    />

                    <CustomerModal 
                        show={showModal}
                        onClose={() => {
                            setShowModal(false);
                            setSelectedCustomer(null);
                            refetchCustomers();
                        }}
                        customer={selectedCustomer}
                    />

                    <CustomersTable 
                        customers={customers}
                        loading={loading}
                        error={error}
                        onEdit={handleEdit}
                        onDelete={(customer) => {
                            // Implementar lógica de exclusão
                            console.log('Excluir cliente:', customer);
                        }}
                        onDebt={handleOpenDebtModal}
                    />

                    <DebtModal 
                        show={showDebtModal}
                        onClose={() => {
                            setShowDebtModal(false);
                            setSelectedCustomer(null);
                        }}
                        customer={selectedCustomer}
                        onSuccess={refetchCustomers}
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default Customers;
