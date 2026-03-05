import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, StarHalf, Minus, Plus, X, Maximize2 } from 'lucide-react';
import { mockProducts } from '../data/products';
import { getProducts } from '../utils/productStorage';
import { addToCart } from '../utils/cartStorage';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../types';
import './ProductDetail.css';

export const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [stockCount, setStockCount] = useState<number | null>(null);

    useEffect(() => {
        // First check hardcoded mock products
        const foundMock = mockProducts.find(p => p.id === id);
        if (foundMock) {
            setProduct(foundMock);
            setActiveImage(foundMock.images?.[0] || foundMock.imageUrl);
            if (foundMock.sizes && foundMock.sizes.length > 0) {
                setSelectedSize(foundMock.sizes[0]);
            }
            setStockCount(null); // mock products don't track stock
            setLoading(false);
            return;
        }

        // Then check Supabase products (from Admin panel)
        getProducts().then(dbProducts => {
            const foundDb = dbProducts.find(p => p.id === id);
            if (foundDb) {
                setProduct({
                    id: foundDb.id,
                    name: foundDb.name,
                    brand: 'SHOP.CO',
                    price: foundDb.discountPercentage > 0
                        ? Math.round(foundDb.price - (foundDb.price * foundDb.discountPercentage / 100))
                        : foundDb.price,
                    originalPrice: foundDb.discountPercentage > 0 ? foundDb.price : undefined,
                    rating: foundDb.rating,
                    reviews: 0,
                    imageUrl: foundDb.image,
                    images: [foundDb.image],
                    description: foundDb.description,
                    category: 'General',
                });
                setActiveImage(foundDb.image);
                setStockCount(foundDb.stock);
            }
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return (
            <div className="product-detail-page">
                <div className="global-loading-overlay">
                    <img src="/gear.svg" alt="Loading..." className="global-loading-icon" />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail-page">
                <div className="product-not-found">
                    <h2>Product Not Found</h2>
                    <p>The product you're looking for doesn't exist or has been removed.</p>
                    <button className="primary-btn" onClick={() => navigate('/shop')} style={{ marginTop: '24px' }}>
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 !== 0;

    const isOutOfStock = stockCount !== null && stockCount === 0;
    const isLowStock = stockCount !== null && stockCount > 0 && stockCount <= 5;
    const maxQuantity = stockCount !== null ? stockCount : Infinity;

    const handleDecreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncreaseQuantity = () => {
        if (quantity < maxQuantity) {
            setQuantity(quantity + 1);
        }
    };

    return (
        <div className="product-detail-page">
            <div className="product-detail-container">
                {/* Left Column: Image Gallery */}
                <div className="product-gallery">
                    <div className="thumbnail-list">
                        {product.images?.map((img, index) => (
                            <div
                                key={index}
                                className={`thumbnail-container ${activeImage === img ? 'active' : ''}`}
                                onClick={() => setActiveImage(img)}
                            >
                                <img src={img} alt={`Thumbnail ${index + 1}`} className="thumbnail-img" />
                            </div>
                        ))}
                    </div>
                    <div className="main-image-container" onClick={() => setIsFullscreen(true)}>
                        <img src={activeImage} alt={product.name} className="main-image" />
                        <div className="expand-overlay">
                            <Maximize2 size={24} color="#fff" />
                        </div>
                    </div>
                </div>

                {/* Right Column: Product Info */}
                <div className="product-info-detail">
                    <h1 className="product-title-detail">{product.name}</h1>

                    <div className="product-rating-detail">
                        <div className="stars">
                            {[...Array(fullStars)].map((_, i) => (
                                <Star key={i} size={20} fill="#FFC633" color="#FFC633" />
                            ))}
                            {hasHalfStar && <StarHalf size={20} fill="#FFC633" color="#FFC633" />}
                        </div>
                        <span className="rating-score-detail">
                            {product.rating}/<span className="rating-max">5</span>
                        </span>
                        <span className="reviews-count">({product.reviews} reviews)</span>
                    </div>

                    <div className="product-price-row-detail">
                        <span className="current-price-detail">${product.price}</span>
                        {product.originalPrice && (
                            <>
                                <span className="original-price-detail">${product.originalPrice}</span>
                                <span className="discount-badge-detail">-{discount}%</span>
                            </>
                        )}
                    </div>

                    <p className="product-description">{product.description}</p>

                    {/* Stock Status */}
                    {stockCount !== null && (
                        <div className="stock-status-detail">
                            {isOutOfStock ? (
                                <span className="stock-indicator stock-indicator--out">Out of Stock</span>
                            ) : isLowStock ? (
                                <span className="stock-indicator stock-indicator--low">Only {stockCount} left in stock!</span>
                            ) : (
                                <span className="stock-indicator stock-indicator--in">In Stock ({stockCount} available)</span>
                            )}
                        </div>
                    )}

                    <div className="divider"></div>

                    {/* Sizing */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="size-selector">
                            <h4 className="selector-title">Choose Size</h4>
                            <div className="size-buttons">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="divider"></div>

                    {/* Add to Cart Actions */}
                    <div className="action-row">
                        <div className="quantity-stepper">
                            <button
                                className="quantity-btn"
                                onClick={handleDecreaseQuantity}
                                disabled={quantity <= 1}
                            >
                                <Minus size={20} />
                            </button>
                            <span className="quantity-display">{quantity}</span>
                            <button
                                className="quantity-btn"
                                onClick={handleIncreaseQuantity}
                                disabled={quantity >= maxQuantity}
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        <button
                            className={`add-to-cart-btn primary-btn ${isOutOfStock ? 'btn-disabled' : ''}`}
                            disabled={isOutOfStock}
                            onClick={async () => {
                                if (isOutOfStock) return;
                                if (!user) {
                                    navigate('/login');
                                    return;
                                }
                                if (product) {
                                    await addToCart({
                                        product_id: product.id,
                                        name: product.name,
                                        price: product.price,
                                        image: product.images?.[0] || product.imageUrl,
                                        size: selectedSize || undefined,
                                        quantity,
                                    });
                                    navigate('/cart');
                                }
                            }}
                        >
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
            {/* Fullscreen Image Modal */}
            {isFullscreen && (
                <div className="fullscreen-modal" onClick={() => setIsFullscreen(false)}>
                    <button className="close-modal-btn" onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}>
                        <X size={32} />
                    </button>
                    <img
                        src={activeImage}
                        alt={product.name}
                        className="fullscreen-image"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};
