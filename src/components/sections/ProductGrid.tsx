import React from 'react';
import { ProductCard } from '../ProductCard/ProductCard';
import type { Product } from '../../types';

interface ProductGridProps {
    title: string;
    products: Product[];
    viewAllLink?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ title, products }) => {
    return (
        <section className="product-grid-section">
            <h2 className="section-title">{title}</h2>

            <div className="products-container">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            <div className="view-all-container">
                <button className="secondary-btn view-all-btn">View All</button>
            </div>
        </section>
    );
};
