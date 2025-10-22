import React from 'react';
import type { MapSector } from '../types';
import { playSound } from '../audioManager';

interface MapViewProps {
  sectors: MapSector[];
  setSectors: React.Dispatch<React.SetStateAction<MapSector[]>>;
}

export const MapView: React.FC<MapViewProps> = ({ sectors, setSectors }) => {

    const handleUnlockSector = (sectorId: string) => {
        // In a real game, this would cost resources
        playSound('gain');
        setSectors(currentSectors => currentSectors.map(s => s.id === sectorId ? { ...s, isUnlocked: true } : s));
    };

    return (
        <div className="p-6 h-full overflow-y-auto">
            <h2 className="text-4xl font-silkscreen text-amber-300 mb-2">World Map</h2>
            <p className="text-stone-400 mb-6">Expand your influence by unlocking new sectors. Be wary of rival presence.</p>

            <div className="map-grid">
                {sectors.map(sector => (
                    <div
                        key={sector.id}
                        className={`map-sector relative aspect-square flex flex-col items-center justify-center p-4 text-center ${sector.isUnlocked ? 'bg-amber-800/50 cursor-pointer' : 'bg-stone-800'}`}
                        onClick={() => !sector.isUnlocked && handleUnlockSector(sector.id)}
                    >
                        {sector.isUnlocked ? (
                            <>
                                <div className="text-4xl">{sector.art}</div>
                                <h3 className="font-bold text-sm">{sector.name}</h3>
                                {sector.rivalPresence > 0 && <div className="absolute top-2 right-2 text-xs bg-red-500 rounded-full w-6 h-6 flex items-center justify-center font-bold">{sector.rivalPresence}</div>}
                            </>
                        ) : (
                             <div className="text-4xl text-stone-500">?</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
