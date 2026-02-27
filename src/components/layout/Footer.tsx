import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-top">
                    <div className="footer-col">
                        <div className="logo" style={{ marginBottom: '16px' }}>SHOP.CO</div>
                        <p style={{ color: 'var(--color-text-light)', fontSize: '14px', maxWidth: '250px' }}>
                            We have clothes that suits your style and which you're proud to wear. From women to men.
                        </p>
                    </div>
                    <div className="footer-col">
                        <h4 className="footer-title">COMPANY</h4>
                        <div className="footer-links">
                            <Link to="/about">About</Link>
                            <Link to="/features">Features</Link>
                            <Link to="/works">Works</Link>
                            <Link to="/career">Career</Link>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h4 className="footer-title">HELP</h4>
                        <div className="footer-links">
                            <Link to="/customer-support">Customer Support</Link>
                            <Link to="/delivery-details">Delivery Details</Link>
                            <Link to="/terms">Terms & Conditions</Link>
                            <Link to="/privacy">Privacy Policy</Link>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>SHOP.CO © 2026. All Rights Reserved</p>
                </div>
            </div>
        </footer>
    );
};
