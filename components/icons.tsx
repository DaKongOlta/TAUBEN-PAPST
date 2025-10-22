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

export const TycoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        aria-label="Tycoon View"
    >
        <path d="M2 20h20v2H2v-2zm2-8h2v7H4v-7zm5 0h2v7H9v-7zm5 0h2v7h-2v-7zm5 0h2v7h-2v-7zM2 7l10-5 10 5v2H2V7z"/>
    </svg>
);

// New Resource Icons
export const BreadCoinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="BreadCoin">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-10.5h2v5h-2v-5zM11.5 7C12.33 7 13 7.67 13 8.5S12.33 10 11.5 10 10 9.33 10 8.5 10.67 7 11.5 7z"/>
    </svg>
);


// Icons for Tabs
export const CampaignIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 3L4 9v12h16V9l-8-6zM6 19v-8.33l6-3.34 6 3.34V19H6z"/></svg>
);

export const RoostIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/></svg>
);

export const MapIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M20.5 3l-3.5 3.5-6-2-6 2-3.5-3.5L1 5v14l3.5-3.5 6 2 6-2 3.5 3.5L23 19V5l-2.5-2zM15 16.5l-6-2V6l6 2v8.5z"/></svg>
);

export const SkillsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v2h-2v-2zm0 4h2v6h-2v-6z"/></svg>
);

export const IntegrationsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M20 10h-4V4h-2v6h-4V4H8v6H4v2h4v4H4v2h4v-4h4v4h2v-4h4v-2z"/></svg>
);

export const FactionsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/></svg>
);

export const ChroniclesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 4h2v8l-1-0.75L9 12V4zm5 14H6V4h1.5v9l3-2.25L14 13V4h4v14z"/></svg>
);

export const MinigamesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h6V4zm2 16h6c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2h-6v16zm-4-2h2v-2h-2v2zm-4-2h2v-2H4v2zm0-4h2V8H4v2zm4 4h2v-2H8v2zm0-4h2V8H8v2zm0-4h2V4H8v2zm6 8h2v-2h-2v2zm0-4h2V8h-2v2zm0-4h2V4h-2v2z"/></svg>
);

export const AscensionIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M16 13h-3V4h-2v9H8l4 4 4-4zM4 19v2h16v-2H4z"/></svg>
);

// Stat Icons
export const XPIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2l2.37 7.26h7.63l-6.16 4.48 2.36 7.26L12 16.52l-6.2 4.48 2.36-7.26-6.16-4.48h7.63L12 2z"/></svg>
);

export const LuckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M16.5 6c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm-9 0C5.57 6 4 7.57 4 9.5S5.57 13 7.5 13s3.5-1.57 3.5-3.5S9.43 6 7.5 6zm0 9C5.57 15 4 16.57 4 18.5S5.57 22 7.5 22s3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm9 0c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5z"/></svg>
);