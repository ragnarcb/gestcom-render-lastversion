// src/components/Button/Button.jsx

import React from 'react';
import './Button.css';

const Button = ({
  text,
  onClick,
  backgroundColor = '#007BFF',
  color = '#fff',
  fontSize = '16px',
  padding = '10px 20px',
  borderRadius = '5px',
  boxShadow = 'none',
  hoverBackgroundColor = '#0056b3',
  width = 'auto',
  children,
}) => {
  return (
    <button
      className="button"
      onClick={onClick}
      style={{
        backgroundColor,
        color,
        fontSize,
        padding,
        borderRadius,
        boxShadow,
        width,
      }}
    >
      {children || text}
    </button>
  );
};

export default Button;