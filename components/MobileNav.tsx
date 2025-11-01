import React, { useState, useEffect, useRef } from 'react';
import { XIcon } from './icons/XIcon';
import { CompassIcon } from './icons/CompassIcon';
import { MoonIcon } from './icons/MoonIcon';
import { SunIcon } from './icons/SunIcon';
import { NAV_LINKS } from '../constants';
import { useDesign } from '../contexts/DesignContext';

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
    onSearchClick: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, onSearchClick }) => {
    const { siteName, logoUrl, socialLinks } = useDesign();
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
    const menuRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef(0);
    const touchMoveY = useRef(0);

    // Effect to lock body scroll when the menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Effect to handle theme changes
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);
    
    // --- Start of swipe-down-to-close gesture logic ---
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.targetTouches[0].clientY;
        touchMoveY.current = e.targetTouches[0].clientY;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchMoveY.current = e.targetTouches[0].clientY;
        const deltaY = touchMoveY.current - touchStartY.current;
        // Only transform if pulling down
        if (deltaY > 0 && menuRef.current) {
            menuRef.current.style.transform = `translateY(${deltaY}px)`;
            menuRef.current.style.transition = 'none';
        }
    };

    const handleTouchEnd = () => {
        const deltaY = touchMoveY.current - touchStartY.current;
        if (deltaY > 100) { // Swipe down threshold
            onClose();
        } else if (menuRef.current) {
            // If not swiped far enough, snap back
            menuRef.current.style.transform = '';
            menuRef.current.style.transition = 'transform 0.3s ease-out';
        }
        touchStartY.current = 0;
        touchMoveY.current = 0;
    };
    // --- End of swipe-down-to-close gesture logic ---

    const handleLinkClick = (href: string) => {
        window.location.hash = href;
        onClose();
    };

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };
    
    // Reset menu panel's transform style when closing animation finishes
    useEffect(() => {
        const panel = menuRef.current;
        const handleTransitionEnd = () => {
            if (!isOpen && panel) {
                panel.style.transform = '';
                panel.style.transition = '';
            }
        };

        if (panel) {
            panel.addEventListener('transitionend', handleTransitionEnd);
        }
        return () => {
            if (panel) {
                panel.removeEventListener('transitionend', handleTransitionEnd);
            }
        };
    }, [isOpen]);

    return (
        <div className="lg:hidden">
            {/* Menu Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                    onClick={onClose}
                />
            )}
            
            <div
                ref={menuRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ maxHeight: '90vh' }}
            >
                <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                     <a href="#" onClick={() => handleLinkClick('#')} className="flex items-center gap-2">
                        {logoUrl ? (
                            <img src={logoUrl} alt={`${siteName} Logo`} className="h-7 w-auto" />
                        ) : (
                            <span className="text-white font-bold text-lg rounded-md w-7 h-7 flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>{siteName.charAt(0).toUpperCase()}</span>
                        )}
                        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{siteName}</h1>
                    </a>
                    <button onClick={onClose} className="p-2 -mr-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <span className="sr-only">Close menu</span>
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <nav className="flex-grow overflow-y-auto p-4">
                    <ul className="space-y-1">
                        {NAV_LINKS.map(link => (
                            <li key={link.name}>
                                <a
                                    href={link.href}
                                    onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
                                    className="block px-4 py-3 rounded-lg text-base font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex-shrink-0 p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
                     <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Theme</span>
                        <button onClick={toggleTheme} aria-label="Toggle theme" className="text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary)] transition-colors p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                        </button>
                    </div>
                     <div className="flex justify-center gap-6">
                        {socialLinks.map(link => (
                            <a key={link.name} href={link.href} aria-label={link.name} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                            <link.Icon className="w-6 h-6" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileNav;