

import React from 'react';
import { InfoCircleIcon } from '../components/icons/InfoCircleIcon';
import { Category } from '../types';

const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.location.hash = href;
};

const SitemapSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mt-8">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">{title}</h2>
    <ul className="space-y-4">
      {children}
    </ul>
  </div>
);

// Manually define the list of support pages to break the circular dependency.
const supportPagesForSitemap = [
    { key: 'faq', title: 'FAQ' },
    { key: 'contact-us', title: 'Contact Us' },
    { key: 'terms-of-service', title: 'Terms of Service' },
    { key: 'privacy-policy', title: 'Privacy Policy' },
    { key: 'disclaimer', title: 'Disclaimer' },
    { key: 'about-us', title: 'About Us' },
];

export const sitemapContent = (siteName: string, categories: Category[]) => (
  <>
    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
      Use our sitemap to easily navigate through all the pages and content categories available on {siteName}. This page serves as a roadmap to help you find exactly what you're looking for.
    </p>

    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-lg flex gap-4">
      <InfoCircleIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
      <div>
        <h3 className="font-bold text-blue-800 dark:text-blue-300">For Webmasters & SEO</h3>
        <p className="text-sm text-blue-700 dark:text-blue-300/90 mt-1">
          Need the XML sitemap for search engine indexing? Access our dynamically generated sitemap.
        </p>
        <a 
          href="#/support/sitemap-xml" 
          onClick={(e) => handleLinkClick(e, '#/support/sitemap-xml')} 
          className="font-semibold text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block text-sm"
        >
          View XML Sitemap &rarr;
        </a>
      </div>
    </div>

    <SitemapSection title="Main Pages">
      <li>
        <a href="#" onClick={(e) => handleLinkClick(e, '#')} className="font-semibold text-purple-600 dark:text-purple-400 hover:underline">
          Homepage
        </a>
        <p className="text-sm text-gray-500 dark:text-gray-400">The main entry point of {siteName}, featuring content categories and featured items.</p>
      </li>
    </SitemapSection>

    <SitemapSection title="Content Categories">
      {categories.filter(cat => !cat.premium).map(category => (
        <li key={category.id}>
          <a
            href={`#/category/${category.id}`}
            onClick={(e) => handleLinkClick(e, `#/category/${category.id}`)}
            className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
          >
            {category.name}
          </a>
          <p className="text-sm text-gray-500 dark:text-gray-400">{category.subtitle}</p>
        </li>
      ))}
    </SitemapSection>

    <SitemapSection title="Support & Information">
      {supportPagesForSitemap.map(({ key, title }) => (
        <li key={key}>
          <a
            href={`#/support/${key}`}
            onClick={(e) => handleLinkClick(e, `#/support/${key}`)}
            className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
          >
            {title}
          </a>
        </li>
      ))}
    </SitemapSection>
  </>
);
