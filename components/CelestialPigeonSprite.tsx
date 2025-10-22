import React from 'react';

export const CelestialPigeonSprite: React.FC = () => {
    return (
      <div className="relative w-48 h-48 pointer-events-none animate-celestial-float">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
           {/* Simple representation of the Pigeon Pope sprite but with a glow/halo */}
           <defs>
                <filter id="celestialGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <g filter="url(#celestialGlow)" stroke="#fefae0">
                {/* Body */}
                <path d="M 30 80 Q 15 60 35 40 C 50 30 70 40 70 60 Q 75 80 50 85 Q 35 85 30 80 Z" fill="#fefae0" strokeWidth="2" />
                {/* Head */}
                <circle cx="38" cy="42" r="12" fill="#fefae0" strokeWidth="2" />
                <circle cx="35" cy="40" r="2.5" fill="#bc6c25" />
                 {/* Hat */}
                <path d="M 38 30 C 30 32 30 20 38 10 C 46 20 46 32 38 30 Z" fill="#fefae0" stroke="#dda15e" strokeWidth="1.5" />
            </g>
        </svg>
      </div>
    );
};
