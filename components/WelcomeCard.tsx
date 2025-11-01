import React from 'react';
import { ExploreIcon } from './icons/ExploreIcon';
import { PopularIcon } from './icons/PopularIcon';
import { useDesign } from '../../contexts/DesignContext';

interface WelcomeCardProps {
    onButtonClick: (filter: string) => void;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ onButtonClick }) => {
    const { heroTitle, heroSubtitle } = useDesign();
    return (
        <section 
            className="text-white p-8 rounded-2xl shadow-lg my-6 text-center"
            style={{ background: 'linear-gradient(to bottom right, var(--color-primary), var(--color-secondary))' }}
        >
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">{heroTitle}</h2>
            <p className="max-w-2xl mx-auto text-white/90 mb-6 text-base sm:text-lg">
                {heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                    onClick={() => onButtonClick('All')}
                    className="bg-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow"
                    style={{ color: 'var(--color-secondary)' }}
                >
                    <ExploreIcon />
                    <span>Explore Content</span>
                </button>
                <button 
                    onClick={() => onButtonClick('Popular')}
                    className="border border-white/80 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                >
                    <PopularIcon />
                    <span>Popular Picks</span>
                </button>
            </div>
        </section>
    );
};