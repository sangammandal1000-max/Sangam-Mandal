import React, { createContext, useState, useContext, useMemo, useEffect, Dispatch, SetStateAction } from 'react';
import { SocialLink } from '../types';
import { TwitterIcon } from '../components/icons/TwitterIcon';
import { InstagramIcon } from '../components/icons/InstagramIcon';
import { FacebookIcon } from '../components/icons/FacebookIcon';
import { YouTubeIcon } from '../components/icons/YouTubeIcon';
import { db } from '../firebase/firebaseConfig';
// FIX: Removed v9 modular import to switch to v8 namespaced API.
// import { doc, getDoc } from 'firebase/firestore';


interface DesignContextType {
  siteName: string;
  setSiteName: (name: string) => void;
  heroTitle: string;
  setHeroTitle: (title: string) => void;
  heroSubtitle: string;
  setHeroSubtitle: (subtitle: string) => void;
  footerSubtitle: string;
  setFooterSubtitle: (subtitle: string) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  logoUrl: string | null;
  setLogoUrl: (url: string | null) => void;
  faviconUrl: string | null;
  setFaviconUrl: (url: string | null) => void;
  socialLinks: SocialLink[];
  setSocialLinks: Dispatch<SetStateAction<SocialLink[]>>;
  metaTitle: string;
  setMetaTitle: (title: string) => void;
  metaDescription: string;
  setMetaDescription: (description: string) => void;
  metaKeywords: string;
  setMetaKeywords: (keywords: string) => void;
}

const DesignContext = createContext<DesignContextType | undefined>(undefined);

const DEFAULT_PRIMARY_COLOR = '#8B5CF6';
const DEFAULT_SECONDARY_COLOR = '#EC4899';
const DEFAULT_ACCENT_COLOR = '#8B5CF6'; 

const INITIAL_SOCIAL_LINKS: SocialLink[] = [
    { id: 'twitter', name: 'Twitter', Icon: TwitterIcon, href: '#' },
    { id: 'instagram', name: 'Instagram', Icon: InstagramIcon, href: '#' },
    { id: 'facebook', name: 'Facebook', Icon: FacebookIcon, href: '#' },
    { id: 'youtube', name: 'YouTube', Icon: YouTubeIcon, href: '#' },
];

export const DesignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteName, setSiteName] = useState('Biozilla');
  const [heroTitle, setHeroTitle] = useState('Welcome to Biozilla');
  const [heroSubtitle, setHeroSubtitle] = useState('Your ultimate destination for Instagram bios, shayari, love quotes, fun facts, and social media captions');
  const [footerSubtitle, setFooterSubtitle] = useState('Your ultimate destination for social media content. Create amazing bios, shayari, quotes, fun facts and captions for Instagram, Facebook, and more.');
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_PRIMARY_COLOR);
  const [secondaryColor, setSecondaryColor] = useState(DEFAULT_SECONDARY_COLOR);
  const [accentColor, setAccentColor] = useState(DEFAULT_ACCENT_COLOR);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(INITIAL_SOCIAL_LINKS);
  
  const [metaTitle, setMetaTitle] = useState('{siteName} – Best Instagram Bios, Quotes & Captions');
  const [metaDescription, setMetaDescription] = useState('Discover the perfect Instagram bios, shayari, love quotes, fun facts, and social media captions. {siteName} is your ultimate source for creative content.');
  const [metaKeywords, setMetaKeywords] = useState('instagram bio, shayari, love quotes, fun facts, social media captions, bio for instagram');

  useEffect(() => {
    const fetchDesignConfig = async () => {
        // FIX: Switched to v8 namespaced API for Firestore.
        const docRef = db.collection('settings').doc('designConfig');
        const docSnap = await docRef.get();

        // FIX: Switched to v8 property for document existence check and added a check for data.
        if (docSnap.exists) {
            const data = docSnap.data();
            if (data) {
                setSiteName(data.siteName || 'Biozilla');
                setHeroTitle(data.heroTitle || 'Welcome to Biozilla');
                setHeroSubtitle(data.heroSubtitle || '');
                setFooterSubtitle(data.footerSubtitle || '');
                setPrimaryColor(data.primaryColor || DEFAULT_PRIMARY_COLOR);
                setSecondaryColor(data.secondaryColor || DEFAULT_SECONDARY_COLOR);
                setAccentColor(data.accentColor || DEFAULT_ACCENT_COLOR);
                setLogoUrl(data.logoUrl || null);
                setFaviconUrl(data.faviconUrl || null);
                setMetaTitle(data.metaTitle || '{siteName} – Best Bios');
                setMetaDescription(data.metaDescription || '');
                setMetaKeywords(data.metaKeywords || '');
            }
        }
    };

    fetchDesignConfig();
  }, []);

  useEffect(() => {
    const styleId = 'dynamic-theme-colors';
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
    }
    
    styleElement.innerHTML = `
      :root {
        --color-primary: ${primaryColor};
        --color-secondary: ${secondaryColor};
        --color-accent: ${accentColor};
      }
    `;
  }, [primaryColor, secondaryColor, accentColor]);

  const value = useMemo(() => ({
    siteName, setSiteName,
    heroTitle, setHeroTitle,
    heroSubtitle, setHeroSubtitle,
    footerSubtitle, setFooterSubtitle,
    primaryColor, setPrimaryColor,
    secondaryColor, setSecondaryColor,
    accentColor, setAccentColor,
    logoUrl, setLogoUrl,
    faviconUrl, setFaviconUrl,
    socialLinks, setSocialLinks,
    metaTitle, setMetaTitle,
    metaDescription, setMetaDescription,
    metaKeywords, setMetaKeywords,
  }), [siteName, heroTitle, heroSubtitle, footerSubtitle, primaryColor, secondaryColor, accentColor, logoUrl, faviconUrl, socialLinks, metaTitle, metaDescription, metaKeywords]);

  return (
    <DesignContext.Provider value={value}>
      {children}
    </DesignContext.Provider>
  );
};

export const useDesign = (): DesignContextType => {
  const context = useContext(DesignContext);
  if (context === undefined) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
};