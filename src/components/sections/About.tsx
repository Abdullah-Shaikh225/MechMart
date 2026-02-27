import React from 'react';
import { Settings, Award, Users, Clock } from 'lucide-react';

export const About: React.FC = () => {
    return (
        <section className="about-section">
            <div className="about-container">
                <div className="about-header">
                    <span className="about-badge">About Us</span>
                    <h2 className="about-title">Engineered for Excellence</h2>
                    <p className="about-description">
                        At Danish AutoParts, we are committed to providing high-quality mechanical components
                        to engineers, manufacturers, and hobbyists worldwide. With over a decade of
                        experience in the industry, we source parts from trusted OEMs and deliver
                        precision-grade components right to your doorstep.
                    </p>
                </div>

                <div className="about-features">
                    <div className="about-feature">
                        <div className="about-feature-icon">
                            <Settings size={28} strokeWidth={1.5} />
                        </div>
                        <h3>Precision Parts</h3>
                        <p>Every component meets strict quality standards with tolerances as tight as ±0.01mm.</p>
                    </div>

                    <div className="about-feature">
                        <div className="about-feature-icon">
                            <Award size={28} strokeWidth={1.5} />
                        </div>
                        <h3>ISO Certified</h3>
                        <p>All our products come from ISO 9001:2015 certified manufacturing facilities.</p>
                    </div>

                    <div className="about-feature">
                        <div className="about-feature-icon">
                            <Users size={28} strokeWidth={1.5} />
                        </div>
                        <h3>Expert Support</h3>
                        <p>Our team of mechanical engineers is available to help you find the right parts.</p>
                    </div>

                    <div className="about-feature">
                        <div className="about-feature-icon">
                            <Clock size={28} strokeWidth={1.5} />
                        </div>
                        <h3>Fast Turnaround</h3>
                        <p>In-stock items ship the same day. Custom orders delivered within 5 business days.</p>
                    </div>
                </div>

                <div className="about-stats-bar">
                    <div className="about-stat">
                        <span className="about-stat-number">10+</span>
                        <span className="about-stat-label">Years in Business</span>
                    </div>
                    <div className="about-stat">
                        <span className="about-stat-number">50K+</span>
                        <span className="about-stat-label">Parts Delivered</span>
                    </div>
                    <div className="about-stat">
                        <span className="about-stat-number">98%</span>
                        <span className="about-stat-label">Customer Satisfaction</span>
                    </div>
                    <div className="about-stat">
                        <span className="about-stat-number">150+</span>
                        <span className="about-stat-label">OEM Partners</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
