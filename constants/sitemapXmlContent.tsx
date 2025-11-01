

import React from 'react';
import { SUPPORT_PAGES_DATA } from './supportPageData';
import { CopyIcon } from '../components/icons/CopyIcon';
import { CheckIcon } from '../components/icons/CheckIcon';
import { Category } from '../types';

const BASE_URL = 'https://www.biozilla.app/';

const generateSitemapXml = (categories: Category[]): string => {
  const today = new Date().toISOString().split('T')[0];

  const urls = [
    // Homepage
    { loc: BASE_URL, lastmod: today, changefreq: 'daily', priority: '1.0' },

    // Category Pages
    ...categories.filter(cat => !cat.premium).map(category => ({
      loc: `${BASE_URL}#/category/${category.id}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8',
    })),

    // Support Pages
    ...Object.keys(SUPPORT_PAGES_DATA)
      .filter(key => key !== 'sitemap-xml') // Exclude the XML sitemap page itself
      .map(pageKey => ({
      loc: `${BASE_URL}#/support/${pageKey}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.5',
    })),
  ];

  const urlEntries = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>`;
};


const XmlSitemapDisplay: React.FC<{ siteName: string; categories: Category[] }> = ({ siteName, categories }) => {
  const [copied, setCopied] = React.useState(false);
  const sitemapXml = generateSitemapXml(categories);

  const handleCopy = () => {
    navigator.clipboard.writeText(sitemapXml).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        This page contains the auto-generated XML sitemap for {siteName}. This format is specifically designed for search engines like Google to help them understand and index our website's content more effectively.
      </p>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        To use this, copy the entire content below and save it as a <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded-md text-sm font-mono">sitemap.xml</code> file in the root directory of your website. Then, submit this file to Google Search Console and other webmaster tools.
      </p>
      <div className="relative">
        <button
          onClick={handleCopy}
          className={`absolute top-2 right-2 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${copied ? 'bg-green-500 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
          aria-label="Copy XML to clipboard"
        >
          {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy XML'}</span>
        </button>
        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
          <code>
            {sitemapXml}
          </code>
        </pre>
      </div>
    </div>
  );
};


export const sitemapXmlContent = (siteName: string, categories: Category[]) => <XmlSitemapDisplay siteName={siteName} categories={categories} />;
