import React, { useState, useEffect, useCallback } from 'react';
import { PigeonPopeSprite } from './PigeonPopeSprite';

interface IntroSequenceProps {
  onComplete: () => void;
}

const introTexts = [
    "In an age of forgotten crumbs...",
    "...and silent rooftops...",
    "...one coo echoed with divine truth.",
    "The era of the Pigeon Pope has begun."
];

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
    const [panelIndex, setPanelIndex] = useState(0);

    const handleSkip = useCallback(() => {
        onComplete();
    }, [onComplete]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (panelIndex < introTexts.length - 1) {
                setPanelIndex(panelIndex + 1);
            } else {
                onComplete();
            }
        }, 4000); // 4 seconds per panel

        return () => clearTimeout(timer);
    }, [panelIndex, onComplete]);

    useEffect(() => {
        const keyHandler = (e: KeyboardEvent) => {
            handleSkip();
        };
        const clickHandler = () => {
            handleSkip();
        };

        window.addEventListener('keydown', keyHandler);
        window.addEventListener('click', clickHandler);
        return () => {
            window.removeEventListener('keydown', keyHandler);
            window.removeEventListener('click', clickHandler);
        };
    }, [handleSkip]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white bg-black">
            <div className="start-screen-bg opacity-40">
                <div className="parallax-layer parallax-clouds"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="scale-125">
                     <PigeonPopeSprite state="idle" />
                </div>
               
                <div className="absolute bottom-[-150px] w-full text-center p-4">
                     <p className="intro-text-panel font-silkscreen text-3xl text-stone-200" style={{textShadow: '2px 2px 4px #000'}}>
                        {introTexts[panelIndex]}
                    </p>
                </div>
            </div>
            
            <div className="absolute bottom-5 text-stone-400 animate-pulse text-sm">
                Press any key to skip...
            </div>
        </div>
    );
};