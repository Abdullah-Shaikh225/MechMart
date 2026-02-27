import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqData = [
    {
        question: 'What types of mechanical parts do you offer?',
        answer: 'We offer a wide range of precision mechanical components including bearings, gears, hydraulic cylinders, couplings, linear motion guides, roller chains, sprockets, shafts, and fasteners — all sourced from trusted OEM manufacturers.',
    },
    {
        question: 'Are your parts ISO certified?',
        answer: 'Yes. All our products come from ISO 9001:2015 certified facilities. Each part undergoes rigorous quality inspection before shipping to ensure it meets industry-standard tolerances and specifications.',
    },
    {
        question: 'Do you offer bulk or wholesale pricing?',
        answer: 'Absolutely! We offer competitive bulk pricing for orders of 50+ units. Contact our sales team through the admin panel or email us at sales@danishautoparts.com for a custom quote.',
    },
    {
        question: 'What is your return and warranty policy?',
        answer: 'We provide a 1-year warranty on all components against manufacturing defects. If a part doesn\'t meet specifications, you can return it within 30 days for a full refund or replacement — no questions asked.',
    },
    {
        question: 'How fast is shipping?',
        answer: 'In-stock items ship the same business day if ordered before 2 PM. Standard delivery takes 3–5 business days. Express and international shipping options are also available at checkout.',
    },
    {
        question: 'Can I get custom-machined parts?',
        answer: 'Yes, we accept custom orders for CNC-machined parts. Upload your CAD drawings or specifications through the admin panel, and our engineering team will provide a quote within 24 hours.',
    },
];

export const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="faq-section">
            <div className="faq-container">
                <span className="faq-badge">Support</span>
                <h2 className="faq-title">Frequently Asked Questions</h2>
                <p className="faq-subtitle">
                    Everything you need to know about our mechanical parts and ordering process.
                </p>

                <div className="faq-list">
                    {faqData.map((item, index) => (
                        <div
                            className={`faq-item ${openIndex === index ? 'faq-item--open' : ''}`}
                            key={index}
                        >
                            <button className="faq-question" onClick={() => toggle(index)}>
                                <span>{item.question}</span>
                                <ChevronDown size={20} className="faq-chevron" />
                            </button>
                            <div className="faq-answer">
                                <p>{item.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
