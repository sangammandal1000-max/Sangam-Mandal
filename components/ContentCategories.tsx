import React, { useState, useEffect, useRef } from 'react';
import { Category } from '../types';
import { iconMap } from './iconMap';

function useOnScreen(
    ref: React.RefObject<HTMLElement>,
    options: IntersectionObserverInit = { threshold: 0.1 },
    triggerOnce = true
) {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIntersecting(true);
                if (triggerOnce && ref.current) {
                    observer.unobserve(ref.current);
                }
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [ref, options, triggerOnce]);

    return isIntersecting;
}


interface CategoryItemProps {
    category: Category;
    onSelect: (categoryId: string) => void;
    index: number;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, onSelect, index }) => {
    const IconComponent = iconMap[category.Icon as unknown as string];

    const iconColors = {
        bio: 'bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400',
        shayari: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
        'love-quotes': 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
        'fun-facts': 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
        captions: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400',
        premium: 'bg-gray-800 text-yellow-400 dark:bg-gray-700 dark:text-yellow-300',
    };

    const itemRef = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(itemRef as React.RefObject<HTMLElement>);
    
    const RotatingBorder = () => (
      <div
        className="absolute inset-0 z-0 animate-[rotate-border_4s_linear_infinite]"
        style={{
          background: `conic-gradient(from 180deg at 50% 50%, #a855f7, #ec4899, #f59e0b, #a855f7)`,
        }}
      />
    );

    const animationClasses = isVisible ? 'animate-category-in' : 'opacity-0';
    const animationStyle = { animationDelay: `${index * 75}ms` };

    const containerClasses = "relative p-[2px] rounded-2xl overflow-hidden shadow-sm";
    const innerContentClasses = "relative z-10 flex items-center gap-4 p-5 w-full bg-white dark:bg-gray-800 rounded-[14px] h-full transition-colors duration-300";

    if (category.premium) {
        return (
            <div 
                ref={itemRef}
                className={`${containerClasses} ${animationClasses}`}
                style={animationStyle}
            >
                <RotatingBorder />
                <div className={`${innerContentClasses} hover:bg-gray-50 dark:hover:bg-gray-700/60`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconColors[category.id] || 'bg-gray-100 dark:bg-gray-700'}`}>
                        {IconComponent && <IconComponent className="w-6 h-6" />}
                    </div>
                    <div className="flex-grow text-left">
                        <h3 className="font-bold text-gray-800 dark:text-gray-100">{category.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{category.subtitle}</p>
                    </div>
                    <button className="bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-lg text-sm hover:bg-yellow-500 transition-colors flex-shrink-0">
                        Upgrade
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div 
            ref={itemRef}
            className={`${containerClasses} ${animationClasses}`}
            style={animationStyle}
        >
            <RotatingBorder />
            <button 
                onClick={() => onSelect(category.id)} 
                className={`${innerContentClasses} text-left hover:bg-gray-50 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconColors[category.id] || 'bg-gray-100 dark:bg-gray-700'}`}>
                    {IconComponent && <IconComponent className="w-6 h-6" />}
                </div>
                <div className="flex-grow text-left">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">{category.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{category.subtitle}</p>
                </div>
                <div className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 font-semibold text-sm w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    {category.count}
                </div>
            </button>
        </div>
    );
}

interface ContentCategoriesProps {
    onCategorySelect: (categoryId: string) => void;
    categories: Category[];
}

const ContentCategories: React.FC<ContentCategoriesProps> = ({ onCategorySelect, categories }) => {
    return (
        <section className="my-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">Content Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category, index) => (
                    <CategoryItem 
                        key={category.id} 
                        category={category} 
                        onSelect={onCategorySelect}
                        index={index}
                    />
                ))}
            </div>
        </section>
    );
}

export default ContentCategories;