import React from 'react';

export const EyeIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
        <path d="M21 12c-2.25 4 -5.75 7 -9 7s-6.75 -3 -9 -7c2.25 -4 5.75 -7 9 -7s6.75 3 9 7" />
    </svg>
);