import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, LogOut } from 'lucide-react';
import { getCartCount } from '../../utils/cartStorage';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
    const [cartCount, setCartCount] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAdmin, signOut } = useAuth();

    const refreshCartCount = useCallback(async () => {
        const count = await getCartCount();
        setCartCount(count);
    }, []);

    useEffect(() => {
        refreshCartCount();
    }, [location, refreshCartCount]);

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <>
            <header className="header-container">
                <div className="header-content">
                    <button className="icon-btn mobile-menu-btn" aria-label="Menu">
                        <Menu size={24} />
                    </button>

                    <div className="header-logo">
                        <Link to="/" className="logo">
                            Danish AutoParts
                        </Link>
                    </div>
                    <nav className="nav-links">
                        <Link to="/shop" className="nav-link">Shop</Link>
                        {isAdmin && (
                            <Link to="/admin" className="nav-link">Admin Panel</Link>
                        )}
                    </nav>

                    <div className="header-actions">
                        <Link to="/cart" className="icon-btn" aria-label="Cart">
                            <ShoppingCart size={24} />
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </Link>

                        {user ? (
                            <button className="header-auth-btn logout-btn" onClick={handleLogout}>
                                <LogOut size={18} /> Logout
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="header-auth-btn login-btn">Login</Link>
                                <Link to="/register" className="header-auth-btn register-btn">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};
