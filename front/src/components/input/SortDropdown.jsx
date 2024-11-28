import React from 'react';
import { BiSortAZ, BiSortZA, BiSortUp, BiSortDown } from 'react-icons/bi';
import { FiCheck } from 'react-icons/fi';
import './SortDropdown.css';

// Configurações predefinidas para diferentes tipos de filtros
const FILTER_CONFIGS = {
    products: [
        {
            id: 'name',
            title: 'Nome',
            options: [
                { value: 'nameAsc', icon: <BiSortAZ />, label: 'Nome (A-Z)' },
                { value: 'nameDesc', icon: <BiSortZA />, label: 'Nome (Z-A)' }
            ]
        },
        {
            id: 'price',
            title: 'Preço',
            options: [
                { value: 'priceAsc', icon: <BiSortUp />, label: 'Menor Preço' },
                { value: 'priceDesc', icon: <BiSortDown />, label: 'Maior Preço' }
            ]
        },
        {
            id: 'stock',
            title: 'Estoque',
            options: [
                { value: 'stockAsc', icon: <BiSortUp />, label: 'Menor Estoque' },
                { value: 'stockDesc', icon: <BiSortDown />, label: 'Maior Estoque' }
            ]
        }
    ],
    customers: [
        {
            id: 'name',
            title: 'Nome',
            options: [
                { value: 'nameAsc', icon: <BiSortAZ />, label: 'Nome (A-Z)' },
                { value: 'nameDesc', icon: <BiSortZA />, label: 'Nome (Z-A)' }
            ]
        },
        {
            id: 'debt',
            title: 'Dívida',
            options: [
                { value: 'debtAsc', icon: <BiSortUp />, label: 'Menor Dívida' },
                { value: 'debtDesc', icon: <BiSortDown />, label: 'Maior Dívida' }
            ]
        },
        {
            id: 'lastPurchase',
            title: 'Última Compra',
            options: [
                { value: 'lastPurchaseAsc', icon: <BiSortUp />, label: 'Mais Antiga' },
                { value: 'lastPurchaseDesc', icon: <BiSortDown />, label: 'Mais Recente' }
            ]
        }
    ],
    sales: [
        {
            id: 'total',
            title: 'Valor Total',
            options: [
                { value: 'totalAsc', icon: <BiSortUp />, label: 'Menor Valor' },
                { value: 'totalDesc', icon: <BiSortDown />, label: 'Maior Valor' }
            ]
        },
        {
            id: 'date',
            title: 'Data',
            options: [
                { value: 'dateAsc', icon: <BiSortUp />, label: 'Mais Antiga' },
                { value: 'dateDesc', icon: <BiSortDown />, label: 'Mais Recente' }
            ]
        }
    ],
}

const SortDropdown = ({ 
    isOpen, 
    onSort, 
    activeFilters = {},
    type = 'products' // tipo do filtro: 'products' ou 'customers'
}) => {
    if (!isOpen) return null;

    const sortOptions = FILTER_CONFIGS[type] || FILTER_CONFIGS.products;

    return (
        <div className="sort-dropdown">
            <div className="sort-header">Filtros</div>
            
            {sortOptions.map((group, index) => (
                <div key={group.id} className="sort-group">
                    <div className="sort-group-title">{group.title}</div>
                    {group.options.map((option) => {
                        const isSelected = activeFilters[group.id] === option.value;
                        
                        return (
                            <button 
                                key={option.value}
                                className={`sort-option ${isSelected ? 'selected' : ''}`}
                                onClick={() => onSort(group.id, option.value)}
                            >
                                <span className="sort-option-content">
                                    <span className="sort-icon">{option.icon}</span>
                                    <span className="sort-label">{option.label}</span>
                                </span>
                                {isSelected && (
                                    <FiCheck className="check-icon" />
                                )}
                            </button>
                        );
                    })}
                    {index < sortOptions.length - 1 && <div className="sort-divider" />}
                </div>
            ))}
        </div>
    );
};

export default SortDropdown;