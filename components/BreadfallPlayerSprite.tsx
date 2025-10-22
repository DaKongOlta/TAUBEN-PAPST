// components/BreadfallPlayerSprite.tsx
import React from 'react';

interface BreadfallPlayerSpriteProps {
  style?: React.CSSProperties;
}

export const BreadfallPlayerSprite: React.FC<BreadfallPlayerSpriteProps> = ({ style }) => {
  return (
    <div className="breadfall-player" style={style}>
        <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-lg">
            {/* Basket */}
            <path d="M 10 70 Q 60 90 110 70 L 100 95 Q 60 115 20 95 Z" fill="#a16207" stroke="#422006" strokeWidth="2" />

            {/* Body */}
            <path d="M 35 80 Q 20 60 40 40 C 50 25 70 25 80 40 Q 100 60 85 80 Z" fill="#d6d3d1" stroke="#a8a29e" strokeWidth="2" />
            
            {/* Wings */}
            <path d="M 35 60 Q 5 40 30 45 Z" fill="#a8a29e" stroke="#78716c" strokeWidth="1.5" />
            <path d="M 85 60 Q 115 40 90 45 Z" fill="#a8a29e" stroke="#78716c" strokeWidth="1.5" />

            {/* Head */}
            <circle cx="60" cy="45" r="15" fill="#d6d3d1" stroke="#a8a29e" strokeWidth="2" />
            <circle cx="53" cy="42" r="3" fill="black" />
            <circle cx="67" cy="42" r="3" fill="black" />
            <path d="M 58 55 L 62 55 L 60 58 Z" fill="#fca5a5" stroke="#ef4444" strokeWidth="1" />
        </svg>
    </div>
  );
};
