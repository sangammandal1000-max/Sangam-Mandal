
import React from 'react';

export const TagIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M11 3l9 9a1.5 1.5 0 0 1 0 2.121l-4.242 4.242a1.5 1.5 0 0 1 -2.121 0l-9 -9v-4a4 4 0 0 1 4 -4h4" />
    <circle cx="9" cy="9" r="2" />
  </svg>
);
