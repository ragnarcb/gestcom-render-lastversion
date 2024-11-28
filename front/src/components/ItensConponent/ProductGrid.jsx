import React, { memo } from 'react';
import Product from './Product';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import './ProductGrid.css';

const ProductGrid = memo(({
    products = [],
    loading,
    error,
    onButtonClick,
    onEditClick,
    buttonText = "Adicionar",
    showButton = true
}) => {
    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState />;
    }

    if (!Array.isArray(products) || products.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="product-grid">
            {products.map(product => {
                if (!product?.id) return null;
                
                return (
                    <Product
                        key={`product-${product.id}`}
                        product={product}
                        onButtonClick={showButton ? () => onButtonClick?.(product) : undefined}
                        onEditClick={() => onEditClick?.(product)}
                        buttonText={showButton ? buttonText : undefined}
                    />
                );
            })}
        </div>
    );
});

ProductGrid.displayName = 'ProductGrid';

export default ProductGrid;
