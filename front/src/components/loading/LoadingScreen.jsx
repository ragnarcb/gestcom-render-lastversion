import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
    return (
        <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p>Carregando...</p>
        </div>
    );
};

export default LoadingScreen; 