import React from 'react';
import type { MapSector, RouteType } from '../types';

interface SectorDetailPanelProps {
  sector: MapSector;
  onClose: () => void;
  onSetRouteMode: (type: RouteType) => void;
}

export const SectorDetailPanel: React.FC<SectorDetailPanelProps> = ({ sector, onClose, onSetRouteMode }) => {
    
    return (
        <div className="absolute top-4 left-4 z-20 bg-stone-900/80 backdrop-blur-sm p-4 rounded-lg border-2 border-amber-300/50 w-80 animate-fade-in-down">
            <button onClick={onClose} className="absolute top-1 right-1 text-xl px-2 rounded-full bg-red-600/80 hover:bg-red-500 font-bold">&times;</button>
            <h3 className="text-2xl font-silkscreen text-amber-300 mb-2">{sector.name}</h3>
            <p className="text-sm text-stone-400 italic mb-4">{sector.description}</p>
            
            <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="font-bold">Rival Presence:</span> <span className="text-red-400">{sector.rivalPresence}%</span></div>
                <div className="flex justify-between"><span className="font-bold">Noise Level:</span> <span>{sector.noise}/100</span></div>
                <div className="flex justify-between"><span className="font-bold">Infrastructure:</span> <span>{sector.buildings.length}/{sector.maxInfrastructureSlots}</span></div>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-600">
                <h4 className="font-bold text-lg mb-2">Create Route</h4>
                <p className="text-xs text-stone-400 mb-2">Select a route type to begin connecting this district.</p>
                <div className="flex gap-2">
                     <button onClick={() => onSetRouteMode('Pilgrim')} className="flex-1 p-2 bg-yellow-600 hover:bg-yellow-500 text-xs rounded font-bold">Pilgrim</button>
                     <button onClick={() => onSetRouteMode('Antenna')} className="flex-1 p-2 bg-blue-600 hover:bg-blue-500 text-xs rounded font-bold">Antenna</button>
                     <button onClick={() => onSetRouteMode('CrumbTransport')} className="flex-1 p-2 bg-lime-600 hover:bg-lime-500 text-xs rounded font-bold">Crumb</button>
                </div>
            </div>
        </div>
    );
};
