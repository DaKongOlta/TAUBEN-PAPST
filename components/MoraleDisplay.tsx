import React from 'react';
import { MoraleIcon } from './icons';

interface MoraleDisplayProps {
  morale: number;
}

export const MoraleDisplay: React.FC<MoraleDisplayProps> = ({ morale }) => {
  const getMoraleStatus = () => {
    if (morale > 80) return { text: 'Zealous', className: 'morale-zealous' };
    if (morale > 40) return { text: 'Content', className: 'morale-content' };
    return { text: 'Wavering', className: 'morale-wavering' };
  };

  const status = getMoraleStatus();
  const isDangerouslyLow = morale < 20;

  return (
    <div className={`flex items-center justify-center gap-2 p-2 rounded-full ${isDangerouslyLow ? 'animate-low-morale-pulse' : ''}`}>
      <MoraleIcon className={`w-8 h-8 ${status.className}`} />
      <span className="font-bold">{morale.toFixed(0)}%</span>
    </div>
  );
};