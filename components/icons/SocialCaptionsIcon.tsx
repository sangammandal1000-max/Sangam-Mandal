
import React from 'react';

export const SocialCaptionsIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M21 15a8 8 0 0 0 -8 -8h-1a8 8 0 0 0 0 16h1a8 8 0 0 0 8 -8z" />
        <path d="M12 11h-1" />
        <path d="M15 11h-1" />
        <path d="M9 11h-1" />
    </svg>
);
