
import React from 'react';
import { helpCenterContent } from './helpCenterContent';
import { contactUsContent } from './contactUsContent';
import { privacyPolicyContent } from './privacyPolicyContent';
import { termsOfServiceContent } from './termsOfServiceContent';
import { aboutUsContent } from './aboutUsContent';
import { disclaimerContent } from './disclaimerContent';
import { sitemapContent } from './sitemapContent';
import { sitemapXmlContent } from './sitemapXmlContent';
import { Category } from '../types';

interface SupportPage {
  title: string;
  content: React.ReactNode | ((siteName: string, categories: Category[]) => React.ReactNode);
}

export const SUPPORT_PAGES_DATA: { [key: string]: SupportPage } = {
  'faq': {
    title: 'FAQ',
    content: helpCenterContent,
  },
  'contact-us': {
    title: 'Contact Us',
    content: contactUsContent,
  },
  'sitemap': {
    title: 'Sitemap',
    content: sitemapContent,
  },
  'terms-of-service': {
    title: 'Terms of Service',
    content: termsOfServiceContent,
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    content: privacyPolicyContent,
  },
  'disclaimer': {
    title: 'Disclaimer',
    content: disclaimerContent,
  },
  'about-us': {
    title: 'About Us',
    content: aboutUsContent,
  },
  'sitemap-xml': {
    title: 'XML Sitemap for Search Engines',
    content: sitemapXmlContent,
  },
};
