import React from 'react';
import type { FollowerAnimationState } from '../types';

interface FollowerPigeonSpriteProps {
  animationState: FollowerAnimationState;
}

export const FollowerPigeonSprite: React.FC<FollowerPigeonSpriteProps> = ({ animationState }) => {
  const animationClass = {
    idle: 'animate-follower-idle',
    pecking: 'animate-follower-peck',
    looking: 'animate-follower-look',
    flapping: 'animate-follower-flap',
  }[animationState];

  return (
    <div className={`relative follower-sprite-container z-20 pointer-events-none ${animationClass}`}>
      <svg viewBox="0 0 50 50" className="w-full h-full drop-shadow-md">
        {/* Adjusted SVG paths from PigeonPopeSprite, scaled down and simplified */}
        <g className="pigeon-body-group">
            {/* Wing */}
            <path className="pigeon-wing" d="M 22 30 Q 32 20 40 32 C 35 37 27 37 22 30 Z" fill="#a8a29e" stroke="#78716c" strokeWidth="1" />
            {/* Body */}
            <path d="M 15 40 Q 7 30 17 20 C 25 15 35 20 35 30 Q 37 40 25 42 Q 17 42 15 40 Z" fill="#d6d3d1" stroke="#a8a29e" strokeWidth="1.2" />
        </g>
        {/* Head Group */}
        <g className="pigeon-head-group">
            {/* Head */}
            <circle cx="19" cy="21" r="6" fill="#d6d3d1" stroke="#a8a29e" strokeWidth="1.2" />
            <circle cx="17" cy="20" r="1.5" fill="black" className="pigeon-eye"/>
            {/* Beak */}
            <path d="M 13 21 L 10 22 L 14 23 Z" fill="#fca5a5" stroke="#ef4444" strokeWidth="0.8" />
        </g>
      </svg>
    </div>
  );
};
