
import React from 'react';

export const ShareBoxIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 5l0 14" />
    <path d="M18 11l-6 -6l-6 6" />
    <path d="M4 20l16 0" />
  </svg>
);
