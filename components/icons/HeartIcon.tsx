import React from 'react';

export const HeartIcon: React.FC<{ className?: string; isFilled?: boolean }> = ({ className = 'w-5 h-5', isFilled = false }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill={isFilled ? "currentColor" : "none"} strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
    </svg>
);