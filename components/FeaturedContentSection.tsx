import React from 'react';
import { FilterTabs } from './FilterTabs';
import { CardGrid } from './CardGrid';
import { ContentItem, Category } from '../types';

interface FeaturedContentSectionProps {
    featuredContentRef: React.RefObject<HTMLElement>;
    selectedFilter: string;
    onSelectFilter: (filter: string) => void;
    filteredItems: ContentItem[];
    categories: Category[];
}

const FeaturedContentSection: React.FC<FeaturedContentSectionProps> = ({
    featuredContentRef,
    selectedFilter,
    onSelectFilter,
    filteredItems,
    categories,
}) => {
    return (
        <section ref={featuredContentRef} className="my-8 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">Featured Content</h2>
            <FilterTabs
                selectedFilter={selectedFilter}
                onSelectFilter={onSelectFilter}
            />
            <CardGrid items={filteredItems} categories={categories} />
        </section>
    );
};

export default FeaturedContentSection;
