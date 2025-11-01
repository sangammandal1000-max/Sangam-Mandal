



import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { MoonIcon } from './icons/MoonIcon';
import { SunIcon } from './icons/SunIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { useDesign } from '../../contexts/DesignContext';
import { NAV_LINKS } from '../constants';
import { MenuIcon } from './icons/MenuIcon';


interface HeaderProps {
  onSearchClick: () => void;
  isAdminPage?: boolean;
  onLogout?: () => void;
  showSearchIcon?: boolean;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchClick, isAdminPage = false, onLogout, showSearchIcon = false, onMenuClick }) => {
  const { siteName, logoUrl } = useDesign();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prevIsDark => !prevIsDark);
  };
  
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.location.hash = href;
  };
  
  // UPDATED: Added a dedicated handler for the logo click.
  // It navigates to the admin login page from public pages, and back to home from the admin dashboard.
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetHash = isAdminPage ? '#' : '#/admin-login';
    window.location.hash = targetHash;
  };


  return (
    <header className={`bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-100 dark:border-gray-800 transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
             <a 
              href={isAdminPage ? '#' : '#/admin-login'} 
              onClick={handleLogoClick}
              className="flex items-center gap-2"
              aria-label={isAdminPage ? `${siteName} Home` : `${siteName} Admin Panel Access`}
            >
              {logoUrl ? (
                <img src={logoUrl} alt={`${siteName} Logo`} className="h-8 w-auto" />
              ) : (
                <span className="text-white font-bold text-xl rounded-lg w-8 h-8 flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>{siteName.charAt(0).toUpperCase()}</span>
              )}
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 sm:block">
                {siteName}
              </h1>
            </a>
          </div>

          {/* Desktop Navigation */}
          {!isAdminPage && (
            <nav className="hidden lg:flex lg:items-center lg:space-x-1">
              {NAV_LINKS.map(link => (
                  <a key={link.name} href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="px-2 py-2 rounded-md text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors whitespace-nowrap">{link.name}</a>
              ))}
            </nav>
          )}

          {/* Right side icons */}
          <div className="flex items-center gap-2">
            {!isAdminPage && (
                <>
                    <button onClick={toggleTheme} aria-label="Toggle theme" className="text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary)] transition-colors p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                    </button>
                    {showSearchIcon && (
                        <button onClick={onSearchClick} aria-label="Search" className="text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary)] transition-colors p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <SearchIcon className="w-5 h-5" />
                        </button>
                    )}
                    {onMenuClick && (
                        <button 
                            onClick={onMenuClick} 
                            aria-label="Open menu" 
                            className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary)] transition-colors lg:hidden hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            <MenuIcon className="w-6 h-6" />
                        </button>
                    )}
                </>
            )}

             {/* UPDATED: Removed the Admin Panel button for public users */}
             {isAdminPage ? (
                <button onClick={onLogout} className="ml-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600">
                    <LogoutIcon className="w-4 h-4" />
                    <span>Logout</span>
                </button>
             ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};