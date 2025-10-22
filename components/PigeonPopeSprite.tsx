import React from 'react';

interface PigeonPopeSpriteProps {
  state: 'idle' | 'pecking';
  hatColor?: string;
}

export const PigeonPopeSprite: React.FC<PigeonPopeSpriteProps> = ({ state, hatColor = '#fefae0' }) => {
  const containerAnimation = state === 'idle' ? 'animate-pope-idle' : '';

  return (
    <div className={`relative w-40 h-40 z-20 pointer-events-none mb-[-2rem] ${containerAnimation}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        <g className="pigeon-body-group">
            {/* Wing */}
            <path className="pigeon-wing" d="M 45 60 Q 65 40 80 65 C 70 75 55 75 45 60 Z" fill="#a8a29e" stroke="#78716c" strokeWidth="1.5" />
            {/* Body */}
            <path d="M 30 80 Q 15 60 35 40 C 50 30 70 40 70 60 Q 75 80 50 85 Q 35 85 30 80 Z" fill="#d6d3d1" stroke="#a8a29e" strokeWidth="2" />
        </g>
        {/* Head Group */}
        <g className={`pigeon-head-group ${state === 'pecking' ? 'animate-head-peck' : ''}`}>
            {/* Head */}
            <circle cx="38" cy="42" r="12" fill="#d6d3d1" stroke="#a8a29e" strokeWidth="2" />
            <circle cx="35" cy="40" r="2.5" fill="black" className="pigeon-eye"/>
            {/* Beak */}
            <path d="M 26 42 L 20 45 L 28 46 Z" fill="#fca5a5" stroke="#ef4444" strokeWidth="1" />
            {/* Hat */}
            <g className={state === 'idle' ? 'animate-pope-hat-bob' : ''}>
                <path d="M 38 30 C 30 32 30 20 38 10 C 46 20 46 32 38 30 Z" fill={hatColor} stroke="#dda15e" strokeWidth="1.5" />
                <path d="M 32 18 L 44 18" stroke="#bc6c25" strokeWidth="2" />
                <path d="M 38 30 L 38 10" stroke="#bc6c25" strokeWidth="1.5" />
            </g>
        </g>
      </svg>
    </div>
  );
};
