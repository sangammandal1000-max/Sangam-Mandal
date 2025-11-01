
import React from 'react';

export const TrendingDownIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <polyline points="3 7 9 13 13 9 21 17" />
    <polyline points="14 17 21 17 21 10" />
  </svg>
);
