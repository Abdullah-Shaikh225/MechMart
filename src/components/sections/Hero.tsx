import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Shield, Truck } from 'lucide-react';
import './home.css';

export const Hero: React.FC = () => {
    return (
        <section className="hero-section">
            <div className="hero-content">
                <span className="hero-badge">⚙️ Industrial Grade Quality</span>
                <h1 className="hero-title">
                    PRECISION MECHANICAL PARTS FOR EVERY PROJECT
                </h1>
                <p className="hero-subtitle">
                    From bearings and gears to hydraulic cylinders and linear guides — source high-quality mechanical components trusted by engineers worldwide.
                </p>
                <Link to="/shop" className="primary-btn hero-btn">Browse Parts</Link>

                <div className="hero-stats-mobile">
                    <div className="stat">
                        <span className="stat-number">5,000+</span>
                        <span className="stat-label">Parts in Stock</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat">
                        <span className="stat-number">150+</span>
                        <span className="stat-label">OEM Brands</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat">
                        <span className="stat-number">12,000+</span>
                        <span className="stat-label">Orders Shipped</span>
                    </div>
                </div>
            </div>
            <div className="hero-image-wrapper">
                <img
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Precision mechanical components and gears"
                    className="hero-image"
                />
                <div className="star-decoration star-large">⚙</div>
                <div className="star-decoration star-small">🔧</div>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
                <div className="trust-badge">
                    <Wrench size={28} strokeWidth={1.5} />
                    <div>
                        <strong>Precision Machined</strong>
                        <span>ISO 9001 Certified Parts</span>
                    </div>
                </div>
                <div className="trust-badge">
                    <Shield size={28} strokeWidth={1.5} />
                    <div>
                        <strong>1-Year Warranty</strong>
                        <span>On All Components</span>
                    </div>
                </div>
                <div className="trust-badge">
                    <Truck size={28} strokeWidth={1.5} />
                    <div>
                        <strong>Fast Shipping</strong>
                        <span>Same Day Dispatch</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
