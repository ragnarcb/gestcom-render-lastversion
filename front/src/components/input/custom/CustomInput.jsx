import React from 'react';
import './CustomInput.css';

const CustomInput = ({ 
    label, 
    type = 'text', 
    name, 
    value, 
    onChange, 
    placeholder,
    rows,
    step,
    required,
    error
}) => {
    const renderInput = () => {
        if (type === 'textarea') {
            return (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`custom-input textarea ${error ? 'error' : ''}`}
                    rows={rows || 3}
                    required={required}
                />
            );
        }

        return (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`custom-input ${error ? 'error' : ''}`}
                step={step}
                required={required}
            />
        );
    };

    return (
        <div className="form-group">
            {label && (
                <label>
                    {label}
                    {required && <span className="required-mark">*</span>}
                </label>
            )}
            {renderInput()}
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default CustomInput;
