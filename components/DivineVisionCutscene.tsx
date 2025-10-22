import React, { useState, useEffect } from 'react';
import { CelestialPigeonSprite } from './CelestialPigeonSprite';

interface DivineVisionCutsceneProps {
  onComplete: () => void;
}

const visionTexts = [
    "A vision...",
    "The sky cracks, revealing a universe of crumbs.",
    "A great migration is foretold.",
    "The flock must ascend.",
];

export const DivineVisionCutscene: React.FC<DivineVisionCutsceneProps> = ({ onComplete }) => {
    const [panelIndex, setPanelIndex] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (panelIndex < visionTexts.length - 1) {
                setPanelIndex(panelIndex + 1);
            } else {
                onComplete();
            }
        }, 3500);

        return () => clearTimeout(timer);
    }, [panelIndex, onComplete]);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center text-white bg-black animate-fade-in" onClick={onComplete}>
             <div className="absolute inset-0 z-0 opacity-30">
                <div className="shimmering-light" style={{ left: '10%', top: '20%', animationDuration: '5s' }}/>
                <div className="shimmering-light" style={{ left: '80%', top: '60%', animationDuration: '7s' }}/>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
                <CelestialPigeonSprite />
                <p className="vision-text-panel mt-8 font-silkscreen text-3xl text-amber-100" style={{textShadow: '2px 2px 8px #fca5a5'}}>
                    {visionTexts[panelIndex]}
                </p>
            </div>
            
            <div className="absolute bottom-5 text-stone-400 animate-pulse text-sm">
                Click to continue...
            </div>
        </div>
    );
};
