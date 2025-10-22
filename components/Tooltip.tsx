import React from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  widthClass?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, className = '', widthClass = 'w-64', position = 'top' }) => {
  
  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <div className={`relative group ${className}`}>
      {children}
      <div
        className={`absolute ${positionClasses[position]} ${widthClass} p-3 text-sm bg-stone-950 text-stone-200 rounded-lg border border-stone-700 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 transform-gpu`}
      >
        {content}
      </div>
    </div>
  );
};
