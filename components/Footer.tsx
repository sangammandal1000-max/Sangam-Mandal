

import React from 'react';
import { useDesign } from '../../contexts/DesignContext';
import { Category } from '../types';

interface FooterProps {
  categories: Category[];
}

const Footer: React.FC<FooterProps> = ({ categories }) => {
  const { siteName, footerSubtitle, logoUrl, socialLinks } = useDesign();

  const quickLinks = (categories || [])
    .filter(cat => !cat.premium)
    .map(cat => ({
      name: cat.name,
      href: `#/category/${cat.id}`
    }));

  const supportLinks = [
    { name: 'FAQ', href: '#/support/faq' },
    { name: 'Contact Us', href: '#/support/contact-us' },
    { name: 'Sitemap', href: '#/support/sitemap' },
    { name: 'Terms of Service', href: '#/support/terms-of-service' },
    { name: 'Privacy Policy', href: '#/support/privacy-policy' },
    { name: 'Disclaimer', href: '#/support/disclaimer' },
    { name: 'About Us', href: '#/support/about-us' },
  ];
  
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Prevent default for hash links that we are handling via state
    if (href.startsWith('#/')) {
        e.preventDefault();
        window.location.hash = href;
    }
    // For external links, the default behavior is fine.
  };

  return (
    <footer className="bg-slate-800 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Logo, Description & Socials */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              {logoUrl ? (
                <img src={logoUrl} alt={`${siteName} Logo`} className="h-8 w-auto" />
              ) : (
                <span className="text-white font-bold text-xl rounded-lg w-8 h-8 flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>{siteName.charAt(0).toUpperCase()}</span>
              )}
              <h1 className="text-2xl font-bold text-white">{siteName}</h1>
            </div>
            <p className="text-slate-400 mb-6 max-w-sm">
              {footerSubtitle}
            </p>
            <div className="flex gap-4">
              {socialLinks.map(link => (
                <a key={link.name} href={link.href} aria-label={link.name} className="text-slate-400 hover:text-white transition-colors">
                  <link.Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer on large screens */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Links */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map(link => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="hover:text-white transition-colors text-slate-400"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-3">
                {supportLinks.map(link => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="hover:text-white transition-colors text-slate-400"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-700 text-center text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} {siteName}. All rights reserved. Made with 
            <span className="text-red-500 mx-1">❤️</span> 
            for content creators.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;