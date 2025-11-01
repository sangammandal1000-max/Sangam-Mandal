import React from 'react';

export interface Category {
  id: string;
  name: string;
  subtitle: string;
  count: number;
  Icon: React.FC<{ className?: string }> | string;
  premium?: boolean;
  subcategories?: { id: string; name: string }[];
}

export interface ContentItem {
  id: string;
  tags: string[];
  text: string;
  views: number;
  likes: number;
  shares?: number;
  createdAt: string; 
  featured?: boolean;
}

export interface SocialLink {
  id: string;
  name: string;
  href: string;
  Icon: React.FC<{ className?: string }>;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string; 
  read?: boolean;
}
