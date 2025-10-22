import React from 'react';

type RivalAnimationState = 'idle' | 'attack' | 'defeat';

interface RivalPopeSpriteProps {
  state: RivalAnimationState;
}

export const RivalPopeSprite: React.FC<RivalPopeSpriteProps> = ({ state }) => {
  const animationClass = {
    idle: 'animate-rival-idle',
    attack: 'animate-rival-attack',
    defeat: 'animate-rival-defeat',
  }[state];

  return (
    <div className={`relative w-24 h-24 pointer-events-none ${animationClass}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full rival-sprite-main">
        {/* Halo */}
        <ellipse cx="50" cy="20" rx="18" ry="5" fill="none" stroke="#a855f7" strokeWidth="2.5" className="rival-halo" />
        {/* Body Group */}
        <g className="rival-body-group">
          {/* Wing */}
          <path className="rival-wing" d="M 45 60 Q 65 40 80 65 C 70 75 55 75 45 60 Z" fill="#57534e" stroke="#292524" strokeWidth="1.5" />
          {/* Body */}
          <path d="M 30 80 Q 15 60 35 40 C 50 30 70 40 70 60 Q 75 80 50 85 Q 35 85 30 80 Z" fill="#78716c" stroke="#44403c" strokeWidth="2" />
        </g>
        {/* Head Group */}
        <g className="rival-head-group">
          {/* Head */}
          <circle cx="38" cy="42" r="12" fill="#78716c" stroke="#44403c" strokeWidth="2" />
          {/* Eye */}
          <g className="rival-eye">
            <circle cx="35" cy="40" r="2.5" fill="#ef4444" />
            <path d="M 30 36 L 40 38" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          {/* Beak */}
          <path d="M 26 42 L 20 45 L 28 46 Z" fill="#a8a29e" stroke="#292524" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
};