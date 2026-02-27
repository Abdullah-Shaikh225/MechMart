import React from 'react';

export const Brands: React.FC = () => {
    return (
        <section className="brands-section">
            <div className="brands-container">
                <span className="brand-logo" style={{ fontFamily: 'sans-serif', fontWeight: 900, fontSize: '24px', letterSpacing: '2px' }}>SKF</span>
                <span className="brand-logo" style={{ fontFamily: 'sans-serif', fontWeight: 800, fontSize: '22px', letterSpacing: '1px' }}>BOSCH</span>
                <span className="brand-logo" style={{ fontFamily: 'sans-serif', fontWeight: 700, fontSize: '22px' }}>TIMKEN</span>
                <span className="brand-logo" style={{ fontFamily: 'sans-serif', fontWeight: 800, fontSize: '22px', letterSpacing: '1px' }}>PARKER</span>
                <span className="brand-logo" style={{ fontFamily: 'sans-serif', fontWeight: 700, fontSize: '22px', letterSpacing: '2px' }}>SIEMENS</span>
                <span className="brand-logo" style={{ fontFamily: 'sans-serif', fontWeight: 800, fontSize: '22px' }}>MISUMI</span>
            </div>
        </section>
    );
};
