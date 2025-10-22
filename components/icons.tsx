import React from 'react';

export const FaithIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`${className} animate-icon-pulse`}
    aria-label="Faith"
  >
    <path d="M12 2c-4.97 0-9 4.03-9 9 0 2.13.75 4.09 2 5.59V21h3.5v-3.54c1.11.34 2.29.54 3.5.54s2.39-.2 3.5-.54V21H19v-4.41c1.25-1.5 2-3.46 2-5.59 0-4.97-4.03-9-9-9zm0 2c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
  </svg>
);

export const CrumbIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-label="Crumbs"
  >
    <path d="M20.5 11c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zM18 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6-5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM4 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm3-7c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
  </svg>
);

export const DivineFavorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
        aria-label="Divine Favor"
    >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
);

export const PigeonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        aria-label="Followers"
    >
        <path d="M18.41,6.41L12,12.82L5.59,6.41L4.18,7.82L12,15.66l7.82-7.84L18.41,6.41M12,2A10,10 0 0,0 2,12a10,10 0 0,0 10,10a10,10 0 0,0 10-10A10,10 0 0,0 12,2Z" transform="scale(1,-1) translate(0,-24)" />
    </svg>
);

export const HeresyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
        aria-label="Heresy"
    >
        <path d="M12 2L1 21h22M12 6l7.5 13h-15m5.5-6.5l-2 3.5h7l-2-3.5-1.5 2.5Z"/>
    </svg>
);

export const MoraleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        aria-label="Flock Morale"
    >
        <path d="M12.3,1.3C11.5,0.5,10.4,0,9.2,0C6.9,0,5,1.9,5,4.2c0,1.2,0.5,2.3,1.3,3.1C2.8,9.6,0,14.4,0,20c0,1.9,1.3,3.4,3,3.9 C4,24,4.9,24,5.9,24c2.8,0,5.2-2.1,5.6-4.9c0.2-1.2-0.5-2.3-1.6-2.6c-1.2-0.3-2.3,0.4-2.6,1.6c-0.2,0.9,0.2,1.8,1,2.3 C7.1,20.8,6.5,19.5,6.5,18c0-3.3,1.7-6.3,4.3-8.2c0.8-0.5,1.2-1.5,1-2.4c-0.2-0.9-1-1.6-1.9-1.6c-0.9,0-1.7,0.5-2.1,1.3 c-0.5,1.1-1.8,1.6-2.8,1.1c-1.1-0.5-1.6-1.8-1.1-2.8C5.5,4.3,6,3.2,7,2.5C8.3,1.7,10,2.1,10.8,3.3c0.6,0.8,1.6,1.1,2.5,0.8 c1.7-0.6,2.5-2.6,1.7-4.2C14.2,0.2,13.2,0,12.3,1.3z" />
    </svg>
);