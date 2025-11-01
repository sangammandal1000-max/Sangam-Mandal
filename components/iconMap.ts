import React from 'react';
import { InstagramIcon } from './icons/InstagramIcon';
import { ShayariIcon } from './icons/ShayariIcon';
import { LoveQuoteIcon } from './icons/LoveQuoteIcon';
import { FunFactsIcon } from './icons/FunFactsIcon';
import { SocialCaptionsIcon } from './icons/SocialCaptionsIcon';
import { PremiumIcon } from './icons/PremiumIcon';

export const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
  InstagramIcon,
  ShayariIcon,
  LoveQuoteIcon,
  FunFactsIcon,
  SocialCaptionsIcon,
  PremiumIcon,
};

export const iconNames = Object.keys(iconMap);
