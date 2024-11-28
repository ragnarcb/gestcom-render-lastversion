// src/components/Product/Product.jsx

import React, { useState } from 'react';
import Button from "../buttons/Button";
import './Product.css';
import defaultProductImage from '/src/assets/images/product_box.webp';

const Product = ({ product, onButtonClick, buttonText = 'Editar Produto' }) => {
    const [imageError, setImageError] = useState(false);
    
    if (!product) return null;

    const truncateText = (text, maxLength = 50) => {
        if (text && text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text || '';
    };

    const {
        nome = 'Sem nome',
        descricao = 'Sem descrição',
        preco = 0,
        quantidade = 0,
        categoria = { nome: 'Sem categoria' },
        imagem
    } = product;

    // Define a imagem a ser exibida
    const imageUrl = imagem && !imageError
        ? `data:image/jpeg;base64,${imagem}`
        : defaultProductImage;

    return (
        <div className="product-container" data-product-id={product.id}>
            <div className="product-image-container">
                <img 
                    src={imageUrl} 
                    alt={nome} 
                    className="product-image"
                    onError={() => setImageError(true)}
                />
            </div>
            <div className="product-info">
                <h3 className="product-title">{nome}</h3>
                <p className="product-description">{truncateText(descricao)}</p>
                <p className="product-price">R$ {Number(preco || 0).toFixed(2)}</p>
                <p className="product-quantity">Qtd: {quantidade || 0}</p>
                <p className="product-category">Categoria: {categoria?.nome || 'Sem categoria'}</p>
            </div>
            <button 
                className="product-button"
                onClick={() => onButtonClick && onButtonClick(product)}
            >
                {buttonText}
            </button>
        </div>
    );
};

export default Product;