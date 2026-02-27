import React from 'react';
import { Hero } from '../components/sections/Hero';
import { Brands } from '../components/sections/Brands';
import { About } from '../components/sections/About';
import { FAQ } from '../components/sections/FAQ';

export const Home: React.FC = () => {
    return (
        <div className="home-page">
            <Hero />
            <Brands />
            <About />
            <FAQ />
        </div>
    );
};
