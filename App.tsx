

import React, { useState, useMemo, useRef, useEffect, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { WelcomeCard } from './components/WelcomeCard';
import { ContentItem, Category } from './types';
import { SUPPORT_PAGES_DATA } from './constants/supportPageData';
import { useDesign } from './contexts/DesignContext';
import { auth, db } from './firebase/firebaseConfig';
import { LoadingSpinner } from './components/LoadingSpinner';

const ContentCategories = lazy(() => import('./components/ContentCategories'));
const FeaturedContentSection = lazy(() => import('./components/FeaturedContentSection'));
const Footer = lazy(() => import('./components/Footer'));
const CategoryPage = lazy(() => import('./components/CategoryPage'));
const SupportPage = lazy(() => import('./components/SupportPage'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const AdminLoginPage = lazy(() => import('./components/AdminLoginPage'));
const MobileNav = lazy(() => import('./components/MobileNav'));
const SearchModal = lazy(() => import('./components/SearchModal'));

function App() {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const featuredContentRef = useRef<HTMLElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const { 
    siteName, 
    primaryColor, 
    faviconUrl,
    metaTitle,
    metaDescription,
    metaKeywords,
  } = useDesign();

  const [currentHash, setCurrentHash] = useState(() => window.location.hash);

  useEffect(() => {
    const fetchContent = async () => {
        try {
            const contentSnapshot = await db.collection('content').get();
            const contentData = contentSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as ContentItem[];
            setContentItems(contentData);

            const categoriesSnapshot = await db.collection('categories').get();
            const categoriesData = categoriesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Category[];
            setCategories(categoriesData);
        } catch (error) {
            console.error("Error fetching data from Firestore:", error);
        } finally {
            setIsDataLoading(false);
        }
    };

    fetchContent();
  }, []);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAdminLoggedIn(!!user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    const updateMetaTag = (selector: string, content: string) => {
        const element = document.querySelector(selector);
        if (element) {
            element.setAttribute('content', content);
        }
    };

    const newTitle = metaTitle.replace('{siteName}', siteName);
    const newDescription = metaDescription.replace('{siteName}', siteName);
    const newImageUrl = `https://placehold.co/1200x630/${primaryColor.substring(1)}/ffffff?text=${encodeURIComponent(siteName)}`;

    document.title = newTitle;
    
    updateMetaTag('meta[name="description"]', newDescription);
    updateMetaTag('meta[name="keywords"]', metaKeywords);
    updateMetaTag('meta[property="og:title"]', newTitle);
    updateMetaTag('meta[property="og:description"]', newDescription);
    updateMetaTag('meta[property="og:image"]', newImageUrl);
    updateMetaTag('meta[property="twitter:title"]', newTitle);
    updateMetaTag('meta[property="twitter:description"]', newDescription);
    updateMetaTag('meta[property="twitter:image"]', newImageUrl);

  }, [siteName, primaryColor, metaTitle, metaDescription, metaKeywords]);

  useEffect(() => {
    const faviconElement = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
    if (faviconElement && faviconUrl) {
      faviconElement.href = faviconUrl;
    }
  }, [faviconUrl]);


  useEffect(() => {
    if (
      !window.location.hash || 
      (window.location.hash.startsWith('#/category/') || 
      window.location.hash.startsWith('#/support/') ||
      window.location.hash.startsWith('#/admin-login')) && !isAdminLoggedIn
    ) {
      // no deep links on first load unless logged in
    }
    
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      window.scrollTo(0, 0); 
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isAdminLoggedIn]);
  
  const activeView = useMemo(() => {
    if (currentHash.startsWith('#/category/')) {
      const categoryId = currentHash.substring('#/category/'.length);
      const category = categories.find(c => c.id === categoryId) || null;
      return { type: 'category' as const, data: category };
    }
    if (currentHash.startsWith('#/support/')) {
      const pageId = currentHash.substring('#/support/'.length);
      const page = SUPPORT_PAGES_DATA[pageId] || null;
      return { type: 'support' as const, data: page };
    }
     if (currentHash.startsWith('#/admin-login')) {
      return { type: 'admin-login' as const, data: null };
    }
    return { type: 'home' as const, data: null };
  }, [currentHash, categories]);

  const filteredItems = useMemo(() => {
    const items: ContentItem[] = contentItems.filter(item => item.featured);

    switch (selectedFilter) {
      case 'Trending':
        return [...items].sort((a, b) => {
          const scoreA = a.likes * 0.7 + a.views * 0.3;
          const scoreB = b.likes * 0.7 + b.views * 0.3;
          return scoreB - scoreA;
        });
      
      case 'Recent':
        return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      case 'Popular':
        return [...items].sort((a, b) => b.views - a.views);

      case 'All':
      default:
        return [...items].sort(() => Math.random() - 0.5);
    }
  }, [selectedFilter, contentItems]);
  
  const handleWelcomeCardClick = (filter: string) => {
    setSelectedFilter(filter);
    featuredContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCategorySelect = (categoryId: string) => {
    window.location.hash = `#/category/${categoryId}`;
  };

  const handleBackToHome = () => {
    window.location.hash = '#';
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    window.location.hash = '#'; 
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      setIsAdminLoggedIn(false);
      window.location.hash = '#/admin-login';
    });
  };

  if (isAuthLoading || isDataLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><LoadingSpinner /></div>;
  }

  if (isAdminLoggedIn) {
    return <Suspense fallback={<LoadingSpinner />}><AdminDashboard onLogout={handleLogout} initialContent={contentItems} initialCategories={categories} /></Suspense>;
  }
  
  if (activeView.type === 'admin-login') {
    return <Suspense fallback={<LoadingSpinner />}><AdminLoginPage onLoginSuccess={handleLoginSuccess} categories={categories} /></Suspense>;
  }

  if (activeView.type === 'category' && activeView.data) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <CategoryPage 
          category={activeView.data} 
          onBack={handleBackToHome} 
          onSearchClick={() => setIsSearchOpen(true)}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          contentItems={contentItems}
          categories={categories}
        />
        <MobileNav 
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            onSearchClick={() => setIsSearchOpen(true)} 
        />
        <SearchModal 
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          items={contentItems}
          categories={categories}
        />
      </Suspense>
    );
  }

  if (activeView.type === 'support' && activeView.data) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <SupportPage 
          pageData={activeView.data} 
          onBack={handleBackToHome} 
          onSearchClick={() => setIsSearchOpen(true)}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          categories={categories}
        />
        <MobileNav 
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            onSearchClick={() => setIsSearchOpen(true)} 
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300 flex flex-col">
      <Header 
        onSearchClick={() => setIsSearchOpen(true)} 
        showSearchIcon={true} 
        onMenuClick={() => setIsMobileMenuOpen(true)}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow w-full">
        <WelcomeCard onButtonClick={handleWelcomeCardClick} />
        <Suspense fallback={<div className="my-8 min-h-[300px]" />}>
            <ContentCategories onCategorySelect={handleCategorySelect} categories={categories} />
        </Suspense>
        <Suspense fallback={<div className="my-8 min-h-[500px]" />}>
            <FeaturedContentSection 
                featuredContentRef={featuredContentRef}
                selectedFilter={selectedFilter}
                onSelectFilter={setSelectedFilter}
                filteredItems={filteredItems}
                categories={categories}
            />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer categories={categories} />
      </Suspense>
      <Suspense fallback={null}>
        <MobileNav 
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            onSearchClick={() => setIsSearchOpen(true)}
        />
        <SearchModal 
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            items={contentItems}
            categories={categories}
        />
      </Suspense>
    </div>
  );
}

export default App;