import { useEffect, useState } from "react";
import { getProducts } from "../utils/productStorage";
import type { Product } from "../types/product";
import { Link } from "react-router-dom";
import { Star, StarHalf, Search } from "lucide-react";
import "../components/ProductCard/ProductCard.css";

export const Shop = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        getProducts().then(data => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="shop-page">
            {loading && (
                <div className="global-loading-overlay">
                    <img src="/gear.svg" alt="Loading..." className="global-loading-icon" />
                </div>
            )}
            <div className="shop-container">
                <div className="shop-search">
                    <Search size={18} className="shop-search-icon" />
                    <input
                        type="text"
                        placeholder="Search products by name..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="shop-search-input"
                    />
                </div>
                <div className="shop-header">
                    <h2 className="shop-heading">Our Products</h2>
                    <p className="shop-subheading">Browse precision-engineered mechanical components for every application</p>
                </div>

                {!loading && filteredProducts.length === 0 ? (
                    <div className="shop-empty">
                        <p>{search ? `No products found for "${search}"` : 'No products available yet. Check back soon!'}</p>
                    </div>
                ) : (
                    <div className="shop-grid">
                        {filteredProducts.map(product => {
                            const fullStars = Math.floor(product.rating);
                            const hasHalfStar = product.rating % 1 !== 0;
                            const discountedPrice = product.discountPercentage > 0
                                ? product.price - (product.price * product.discountPercentage / 100)
                                : null;

                            return (
                                <Link to={`/product/${product.id}`} key={product.id} className="product-card">
                                    <div className="product-image-container">
                                        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
                                        {product.discountPercentage > 0 && (
                                            <span className="discount-badge">-{product.discountPercentage}%</span>
                                        )}
                                    </div>
                                    <div className="product-info">
                                        <h3 className="product-title">{product.name}</h3>
                                        <p className="product-description">{product.description}</p>

                                        <div className="product-bottom">
                                            <div className="product-price-row">
                                                {discountedPrice ? (
                                                    <>
                                                        <span className="current-price">${Math.round(discountedPrice)}</span>
                                                        <span className="original-price">${product.price}</span>
                                                    </>
                                                ) : (
                                                    <span className="current-price">${product.price}</span>
                                                )}
                                            </div>

                                            <div className="product-rating">
                                                <div className="stars">
                                                    {[...Array(fullStars)].map((_, i) => (
                                                        <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                                                    ))}
                                                    {hasHalfStar && <StarHalf size={14} fill="#f59e0b" color="#f59e0b" />}
                                                </div>
                                                <span className="rating-score">
                                                    {product.rating}<span className="rating-max">/5</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
