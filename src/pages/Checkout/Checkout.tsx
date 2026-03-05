import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { getCart, clearCart } from '../../utils/cartStorage';
import { decrementStock } from '../../utils/productStorage';
import { useAuth } from '../../context/AuthContext';
import type { CartItem } from '../../utils/cartStorage';
import './Checkout.css';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const Checkout: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);

    useEffect(() => {
        getCart().then(items => {
            setCartItems(items);
            setLoading(false);
        });
    }, []);

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = Math.round(subtotal * 0.2);
    const deliveryFee = subtotal > 0 ? 15 : 0;
    const total = subtotal - discount + deliveryFee;

    const sendOrderEmail = async () => {
        const templateParams = {
            email: user?.email || '',
            orders: cartItems.map(item => ({
                name: item.name,
                price: item.price * item.quantity,
                units: item.quantity,
            })),
            cost: {
                shipping: deliveryFee,
                tax: 0,
                total: total,
            },
        };

        try {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
            console.log('Order confirmation email sent!');
        } catch (err) {
            console.error('Failed to send email:', err);
            // Don't block order if email fails
        }
    };

    const handlePlaceOrder = async () => {
        setPlacingOrder(true);
        try {
            // Deduct stock for each cart item
            for (const item of cartItems) {
                await decrementStock(item.product_id, item.quantity);
            }

            // Send order confirmation email
            await sendOrderEmail();

            // Clear the cart after successful stock deduction
            await clearCart();

            alert('Order placed successfully! A confirmation email has been sent to your inbox. 🎉');
            navigate('/shop');
        } catch (err) {
            console.error('Error placing order:', err);
            alert('Failed to place order. Some items may be out of stock. Please try again.');
        }
        setPlacingOrder(false);
    };

    if (loading) {
        return (
            <div className="checkout-page">
                <div className="global-loading-overlay">
                    <img src="/gear.svg" alt="Loading..." className="global-loading-icon" />
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="checkout-page">
                <div className="checkout-empty">
                    <h1 className="checkout-heading">Checkout</h1>
                    <p>Your cart is empty. Add some items first!</p>
                    <Link to="/shop" className="primary-btn" style={{ display: 'inline-block', marginTop: '16px' }}>
                        Go to Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <h1 className="checkout-heading">Checkout</h1>
            <div className="checkout-layout">
                <div className="checkout-form-section">
                    <h2 className="checkout-section-title">Shipping Information</h2>
                    <form className="checkout-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="checkout-row">
                            <div className="checkout-field">
                                <label>First Name</label>
                                <input type="text" placeholder="John" required />
                            </div>
                            <div className="checkout-field">
                                <label>Last Name</label>
                                <input type="text" placeholder="Doe" required />
                            </div>
                        </div>
                        <div className="checkout-field">
                            <label>Email</label>
                            <input type="email" defaultValue={user?.email ?? ''} required />
                        </div>
                        <div className="checkout-field">
                            <label>Address</label>
                            <input type="text" placeholder="123 Main St" required />
                        </div>
                        <div className="checkout-row">
                            <div className="checkout-field">
                                <label>City</label>
                                <input type="text" placeholder="New York" required />
                            </div>
                            <div className="checkout-field">
                                <label>Zip Code</label>
                                <input type="text" placeholder="10001" required />
                            </div>
                        </div>
                        <div className="checkout-field">
                            <label>Phone</label>
                            <input type="tel" placeholder="+1 (555) 000-0000" />
                        </div>
                        <button
                            type="button"
                            className="primary-btn place-order-btn"
                            onClick={handlePlaceOrder}
                            disabled={placingOrder}
                        >
                            {placingOrder ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>
                </div>

                <div className="checkout-summary">
                    <h2 className="checkout-section-title">Order Summary</h2>
                    <div className="checkout-items">
                        {cartItems.map((item) => (
                            <div className="checkout-item" key={item.id}>
                                <div className="checkout-item-thumb">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="checkout-item-info">
                                    <span className="checkout-item-name">{item.name}</span>
                                    {item.size && <span className="checkout-item-size">Size: {item.size}</span>}
                                    <span className="checkout-item-qty">Qty: {item.quantity}</span>
                                </div>
                                <span className="checkout-item-price">${item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>
                    <div className="checkout-totals">
                        <div className="checkout-total-row">
                            <span>Subtotal</span><span>${subtotal}</span>
                        </div>
                        <div className="checkout-total-row">
                            <span>Discount (-20%)</span><span className="checkout-discount">-${discount}</span>
                        </div>
                        <div className="checkout-total-row">
                            <span>Delivery</span><span>${deliveryFee}</span>
                        </div>
                        <div className="checkout-divider"></div>
                        <div className="checkout-total-row checkout-grand-total">
                            <span>Total</span><span>${total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
