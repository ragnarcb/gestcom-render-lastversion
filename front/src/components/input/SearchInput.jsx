import React, { useState, useRef, useEffect } from 'react';
import { FiFilter } from 'react-icons/fi';
import SortDropdown from './SortDropdown';
import './SearchInput.css';

const SearchInput = ({ 
    placeholder, 
    value, 
    onChange,
    onSortChange,
    activeFilters,
    filterType
}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsFilterOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="search-container">
            <div className="search-wrapper">
                <input 
                    type="text" 
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="search-input"
                />
                <button 
                    ref={buttonRef}
                    className={`filter-button ${isFilterOpen ? 'active' : ''}`}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                    <FiFilter />
                </button>
                
                <div ref={dropdownRef}>
                    <SortDropdown 
                        isOpen={isFilterOpen}
                        onSort={onSortChange}
                        activeFilters={activeFilters}
                        type={filterType}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchInput;