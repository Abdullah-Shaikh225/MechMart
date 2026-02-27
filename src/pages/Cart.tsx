import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { getCart, updateCartQuantity, removeFromCart } from '../utils/cartStorage';
import { useAuth } from '../context/AuthContext';
import type { CartItem } from '../utils/cartStorage';
import './Cart.css';

export const Cart: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    const refreshCart = async () => {
        const items = await getCart();
        setCartItems(items);
        setLoading(false);
    };

    useEffect(() => {
        refreshCart();
    }, []);

    const handleQuantityChange = async (rowId: number, newQty: number) => {
        await updateCartQuantity(rowId, newQty);
        refreshCart();
    };

    const handleRemove = async (rowId: number) => {
        await removeFromCart(rowId);
        refreshCart();
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = Math.round(subtotal * 0.2);
    const deliveryFee = subtotal > 0 ? 15 : 0;
    const total = subtotal - discount + deliveryFee;

    if (loading) {
        return (
            <div className="cart-page">
                <div className="global-loading-overlay">
                    <img src="/gear.svg" alt="Loading..." className="global-loading-icon" />
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-empty">
                    <h1 className="cart-heading">YOUR CART</h1>
                    <p>Your cart is empty.</p>
                    <Link to="/shop" className="primary-btn" style={{ display: 'inline-block', marginTop: '16px' }}>
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1 className="cart-heading">YOUR CART</h1>
            <div className="cart-layout">
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div className="cart-item" key={item.id}>
                            <div className="cart-item-image-container">
                                <img src={item.image} alt={item.name} className="cart-item-image" />
                            </div>
                            <div className="cart-item-details">
                                <div className="cart-item-top">
                                    <div>
                                        <h3 className="cart-item-name">{item.name}</h3>
                                        {item.size && <p className="cart-item-size">Size: {item.size}</p>}
                                    </div>
                                    <button
                                        className="cart-item-remove"
                                        onClick={() => handleRemove(item.id!)}
                                        aria-label="Remove item"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                                <div className="cart-item-bottom">
                                    <span className="cart-item-price">${item.price}</span>
                                    <div className="cart-item-qty">
                                        <button
                                            className="qty-btn"
                                            onClick={() => handleQuantityChange(item.id!, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="qty-value">{item.quantity}</span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => handleQuantityChange(item.id!, item.quantity + 1)}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="order-summary">
                    <h2 className="summary-title">Order Summary</h2>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span className="summary-value">${subtotal}</span>
                    </div>
                    <div className="summary-row discount-row">
                        <span>Discount (-20%)</span>
                        <span className="summary-value discount-value">-${discount}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery Fee</span>
                        <span className="summary-value">${deliveryFee}</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row summary-total">
                        <span>Total</span>
                        <span className="summary-value">${total}</span>
                    </div>
                    <button className="primary-btn checkout-btn" onClick={() => {
                        if (user) {
                            navigate('/checkout');
                        } else {
                            navigate('/register');
                        }
                    }}>
                        Go to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};
