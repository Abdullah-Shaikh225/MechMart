import React from 'react';
import { Link } from 'react-router-dom';
import { Star, StarHalf } from 'lucide-react';
import type { Product } from '../../types';
import './ProductCard.css';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    // Simple hardcoded rating calculation for visual
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 !== 0;

    return (
        <Link to={`/product/${product.id}`} className="product-card">
            <div className="product-image-container">
                <img src={product.imageUrl} alt={product.name} className="product-image" loading="lazy" />
            </div>
            <div className="product-info">
                <h3 className="product-title">{product.name}</h3>

                <div className="product-rating">
                    <div className="stars">
                        {[...Array(fullStars)].map((_, i) => (
                            <Star key={i} size={16} fill="#FFC633" color="#FFC633" />
                        ))}
                        {hasHalfStar && <StarHalf size={16} fill="#FFC633" color="#FFC633" />}
                    </div>
                    <span className="rating-score">
                        {product.rating}/<span className="rating-max">5</span>
                    </span>
                </div>

                <div className="product-price-row">
                    <span className="current-price">${product.price}</span>
                    {product.originalPrice && (
                        <>
                            <span className="original-price">${product.originalPrice}</span>
                            <span className="discount-badge">-{discount}%</span>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
};
