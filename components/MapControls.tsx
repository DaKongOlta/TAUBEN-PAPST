import React from 'react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({ onZoomIn, onZoomOut, onReset }) => {
  return (
    <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
      <button onClick={onZoomIn} className="w-10 h-10 bg-stone-800 hover:bg-stone-700 rounded-md text-xl font-bold border border-stone-600">+</button>
      <button onClick={onZoomOut} className="w-10 h-10 bg-stone-800 hover:bg-stone-700 rounded-md text-xl font-bold border border-stone-600">-</button>
      <button onClick={onReset} className="w-10 h-10 bg-stone-800 hover:bg-stone-700 rounded-md text-sm font-bold border border-stone-600">Reset</button>
    </div>
  );
};
