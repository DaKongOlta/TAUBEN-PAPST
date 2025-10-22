import React from 'react';

interface FaithOscillatorProps {
  angle: number;
  multiplier: number;
}

export const FaithOscillator: React.FC<FaithOscillatorProps> = ({ angle, multiplier }) => {
  const getMultiplierColor = () => {
    if (multiplier < 1) return 'text-red-400';
    if (multiplier > 4) return 'text-green-400';
    return 'text-amber-300';
  };

  return (
    <div className="faith-oscillator-container">
      <div className="pendulum-pivot"></div>
      <div className="pendulum-arm" style={{ transform: `rotate(${angle}deg)` }}>
        <div className="pendulum-bob">🍞</div>
      </div>
      <div className="oscillator-gauge">
        <div className="gauge-min">0.2x</div>
        <div className="gauge-max">5x</div>
      </div>
      <div className="oscillator-display">
        <h4 className="font-silkscreen text-sm">Faith Oscillator</h4>
        <p className={`font-bold text-2xl transition-colors duration-300 ${getMultiplierColor()}`}>
          ×{multiplier.toFixed(2)}
        </p>
      </div>
    </div>
  );
};
