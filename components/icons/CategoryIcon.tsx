import React from 'react';

export const CategoryIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M4 4h6v6h-6z" />
    <path d="M14 4h6v6h-6z" />
    <path d="M4 14h6v6h-6z" />
    <path d="M14 14h6v6h-6z" />
  </svg>
);
