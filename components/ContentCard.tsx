import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { ContentItem, Category } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { HeartIcon } from './icons/HeartIcon';
import { ShareIcon } from './icons/ShareIcon';
import { EyeIcon } from './icons/EyeIcon';
import { useDesign } from '../contexts/DesignContext';

interface ContentCardProps {
  item: ContentItem;
  displaySubcategory?: boolean;
  categories: Category[];
}

export const ContentCard: React.FC<ContentCardProps> = ({ item, categories, displaySubcategory = false }) => {
  const { siteName } = useDesign();
  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes);
  const [viewCount, setViewCount] = useState(item.views);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isFlowing, setIsFlowing] = useState(false);
  const animationTimeoutRef = useRef<number | null>(null);

  const incrementViewCountOnce = useCallback(() => {
    if (!hasInteracted) {
      setViewCount(prev => prev + 1);
      setHasInteracted(true);
    }
  }, [hasInteracted]);
  
  const triggerFlow = useCallback(() => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    setIsFlowing(true);
    animationTimeoutRef.current = window.setTimeout(() => {
      setIsFlowing(false);
    }, 1200); 
  }, []);

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(() => {
    incrementViewCountOnce();
    triggerFlow();
    navigator.clipboard.writeText(item.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [item.text, incrementViewCountOnce, triggerFlow]);
  
  const handleLike = useCallback(() => {
    if (isLiked) {
      return;
    }
    incrementViewCountOnce();
    triggerFlow();
    setIsLiked(true);
    setLikeCount(prev => prev + 1);
  }, [isLiked, incrementViewCountOnce, triggerFlow]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out this content from ${siteName}!`,
          text: item.text,
        });
        incrementViewCountOnce();
        triggerFlow();
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(item.text).then(() => {
        alert('Sharing not supported, content copied to clipboard!');
      });
    }
  }, [item.text, siteName, incrementViewCountOnce, triggerFlow]);

  const safeTags = Array.isArray(item.tags) ? item.tags : [];
  const mainCategoryId = safeTags[0]?.toLowerCase();
  const subcategoryTag = safeTags.length > 1 ? safeTags[1] : null;

  const mainCategory = categories.find(c => c.id === mainCategoryId);
  const subcategoryDetails = mainCategory?.subcategories?.find(sc => sc.id === subcategoryTag);
  
  const tagToDisplay = displaySubcategory && subcategoryDetails ? subcategoryDetails.name : mainCategory?.name;
  const IconComponent = mainCategory?.Icon; // Icon component name must be stored in Firestore

  const categoryColors = {
    bio: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-400',
    shayari: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400',
    'love-quotes': 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
    'fun-facts': 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400',
    captions: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400',
  };
  const categoryColorClass = mainCategoryId && categoryColors[mainCategoryId] 
    ? categoryColors[mainCategoryId] 
    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';

  const gradientColors = {
    bio: 'from-pink-500 to-rose-500',
    shayari: 'from-purple-500 to-indigo-500',
    'love-quotes': 'from-red-500 to-orange-500',
    'fun-facts': 'from-green-400 to-teal-500',
    captions: 'from-yellow-400 to-amber-500',
  };
  const gradientColorClass = mainCategoryId && gradientColors[mainCategoryId] 
    ? gradientColors[mainCategoryId] 
    : 'from-gray-500 to-gray-600';

  const flowStyle = useMemo(() => {
    const flowColors = {
        bio: { color1: '#ec4899', color2: '#f43f5e' },
        shayari: { color1: '#a855f7', color2: '#6366f1' },
        'love-quotes': { color1: '#ef4444', color2: '#f97316' },
        'fun-facts': { color1: '#4ade80', color2: '#14b8a6' },
        captions: { color1: '#facc15', color2: '#f59e0b' },
    };
    const colors = (mainCategoryId && flowColors[mainCategoryId]) 
      ? flowColors[mainCategoryId] 
      : { color1: '#6b7280', color2: '#4b5563' }; 
    
    return {
      background: `conic-gradient(from 180deg at 50% 50%, ${colors.color1}, ${colors.color2}, ${colors.color1})`,
    } as React.CSSProperties;
  }, [mainCategoryId]);

  return (
    <div className="relative h-full rounded-2xl shadow-sm overflow-hidden p-[1px] bg-gray-100 dark:bg-gray-700">
      {isFlowing && (
        <div
          className="absolute inset-0 z-0 animate-card-border-flow"
          style={flowStyle}
        />
      )}
      <div className="relative z-10 bg-white dark:bg-gray-800 rounded-[15px] p-5 pt-6 flex flex-col gap-4 h-full">
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientColorClass}`}></div>
        
        <div className="flex justify-between items-start no-print">
          <div className="flex gap-2 flex-wrap">
            {tagToDisplay && IconComponent ? (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${categoryColorClass}`}>
                {/* Note: Icon component must be mapped from string stored in Firestore */}
                {/* <IconComponent className="w-3.5 h-3.5" /> */}
                <span>{tagToDisplay}</span>
              </span>
            ) : null}
          </div>
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-pink-500 dark:text-pink-400' : 'text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400'}`}
          >
            <HeartIcon className="w-5 h-5" isFilled={isLiked} />
            <span className="font-semibold text-sm">{likeCount}</span>
          </button>
        </div>
        <p 
          className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap select-none secure-content"
          onContextMenu={(e) => e.preventDefault()}
          onCopy={(e) => e.preventDefault()}
        >
          {item.text}
        </p>
        <div className="flex justify-between items-center mt-auto text-gray-500 dark:text-gray-400 no-print">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <EyeIcon className="w-5 h-5"/>
              <span>{viewCount} views</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
              <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-semibold"
              >
                  <ShareIcon className="w-4 h-4" />
                  <span>Share</span>
              </button>
              <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${copied ? 'bg-green-500 text-white' : 'text-white'}`}
                  style={!copied ? { backgroundColor: 'var(--color-primary)' } : {}}
              >
                  {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};