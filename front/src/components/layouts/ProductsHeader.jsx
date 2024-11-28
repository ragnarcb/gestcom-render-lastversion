import React from 'react';
import SearchInput from '../input/SearchInput';
import './ProductsHeader.css';

const ProductsHeader = ({ 
    searchTerm, 
    onSearchChange, 
    onSortChange,
    activeFilters,
    filterType,
    onAddClick,
    addButtonText
}) => {
    const defaultButtonText = filterType === 'customers' ? 'Cadastrar Novo Cliente' : 'Adicionar Produto';

    return (
        <div className="products-header">
            <div className="products-controls">
                <div className="search-container">
                    <SearchInput
                        placeholder={filterType === 'customers' ? "Pesquisar clientes..." : "Pesquisar produtos..."}
                        value={searchTerm}
                        onChange={onSearchChange}
                        onSortChange={onSortChange}
                        activeFilters={activeFilters}
                        filterType={filterType}
                    />
                </div>
                <button 
                    className="add-button"
                    onClick={onAddClick}
                >
                    {addButtonText || defaultButtonText}
                </button>
            </div>
        </div>
    );
};

export default ProductsHeader;