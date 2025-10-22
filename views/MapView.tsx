import React, { useState, useRef } from 'react';
import type { MapSector, MapRoute, RouteType } from '../types';
import { playSound } from '../audioManager';
import { usePanZoom } from '../hooks/usePanZoom';
import { MapControls } from '../components/MapControls';
import { SectorDetailPanel } from '../components/SectorDetailPanel';

interface MapViewProps {
  sectors: MapSector[];
  setSectors: React.Dispatch<React.SetStateAction<MapSector[]>>;
  routes: MapRoute[];
  onAddRoute: (from: string, to: string, type: RouteType) => void;
}

const MAP_WIDTH = 2000;
const MAP_HEIGHT = 2000;

const SectorComponent: React.FC<{ sector: MapSector, onClick: () => void }> = ({ sector, onClick }) => (
    <div
        className={`map-sector absolute ${sector.isUnlocked ? 'unlocked cursor-pointer hover:!z-20' : 'bg-stone-800'}`}
        style={{
            left: `${(sector.position.x / 100) * MAP_WIDTH}px`,
            top: `${(sector.position.y / 100) * MAP_HEIGHT}px`,
            width: '120px',
            height: '138px',
            transform: 'translate(-50%, -50%)',
            zIndex: sector.isUnlocked ? 10 : 5,
        }}
        onClick={onClick}
    >
        <div className={`w-full h-full flex flex-col items-center justify-center p-2 text-center ${sector.isUnlocked ? 'bg-amber-800/50' : ''}`}>
            {sector.isUnlocked ? (
                <>
                    <div className="text-4xl">{sector.art}</div>
                    <h3 className="font-bold text-sm">{sector.name}</h3>
                    {sector.rivalPresence > 0 && <div className="absolute top-2 right-2 text-xs bg-red-500 rounded-full w-6 h-6 flex items-center justify-center font-bold">{sector.rivalPresence}</div>}
                    {sector.activeEvent && <div className="absolute top-2 left-2 text-2xl animate-pulse">{sector.activeEvent.art}</div>}
                </>
            ) : (
                <div className="text-4xl text-stone-500">?</div>
            )}
        </div>
    </div>
);

const RouteLine: React.FC<{ route: MapRoute, sectors: MapSector[] }> = ({ route, sectors }) => {
    const from = sectors.find(s => s.id === route.fromSectorId);
    const to = sectors.find(s => s.id === route.toSectorId);
    if (!from || !to) return null;

    const x1 = (from.position.x / 100) * MAP_WIDTH;
    const y1 = (from.position.y / 100) * MAP_HEIGHT;
    const x2 = (to.position.x / 100) * MAP_WIDTH;
    const y2 = (to.position.y / 100) * MAP_HEIGHT;

    const colors: Record<RouteType, string> = {
        'Pilgrim': '#fde047', // yellow
        'Antenna': '#60a5fa', // blue
        'CrumbTransport': '#a3e635' // lime
    };

    return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors[route.type]} strokeWidth="3" strokeDasharray="5,5" />;
};


export const MapView: React.FC<MapViewProps> = ({ sectors, setSectors, routes, onAddRoute }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const { transform, startPan, endPan, pan, zoom, resetZoom, manualZoom } = usePanZoom();
    const [selectedSector, setSelectedSector] = useState<MapSector | null>(null);
    const [routeMode, setRouteMode] = useState<{from: MapSector, type: RouteType} | null>(null);

    const handleSelectSector = (sector: MapSector) => {
        if (routeMode && routeMode.from.id !== sector.id && sector.isUnlocked) {
            onAddRoute(routeMode.from.id, sector.id, routeMode.type);
            setRouteMode(null);
            setSelectedSector(null);
            return;
        }

        if (sector.isUnlocked) {
            setSelectedSector(sector);
            setRouteMode(null);
        } else {
            // In a real game, this would have a cost
            playSound('upgrade');
            setSectors(current => current.map(s => s.id === sector.id ? { ...s, isUnlocked: true } : s));
        }
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <h2 className="text-4xl font-silkscreen text-amber-300 mb-2">Sky-City Map</h2>
            <p className="text-stone-400 mb-6">Expand your influence across the rooftops. Pan with your mouse and zoom with the scroll wheel.</p>

            <div className="flex-grow bg-stone-900/50 rounded-lg relative overflow-hidden" ref={mapContainerRef}>
                <div 
                    className={`absolute top-0 left-0 w-full h-full ${routeMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}`}
                    onMouseDown={startPan}
                    onMouseMove={pan}
                    onMouseUp={endPan}
                    onMouseLeave={endPan}
                    onWheel={(e) => zoom(e, mapContainerRef.current)}
                >
                    <div 
                        style={{
                            width: MAP_WIDTH,
                            height: MAP_HEIGHT,
                            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                            transformOrigin: '0 0',
                        }}
                    >
                        <svg width={MAP_WIDTH} height={MAP_HEIGHT} className="absolute top-0 left-0 pointer-events-none z-[8]">
                            {routes.map(route => <RouteLine key={route.id} route={route} sectors={sectors} />)}
                        </svg>

                        {sectors.map(sector => (
                            <SectorComponent key={sector.id} sector={sector} onClick={() => handleSelectSector(sector)} />
                        ))}
                    </div>
                </div>

                <MapControls onZoomIn={() => manualZoom('in')} onZoomOut={() => manualZoom('out')} onReset={resetZoom} />

                {selectedSector && !routeMode && (
                    <SectorDetailPanel 
                        sector={selectedSector} 
                        onClose={() => setSelectedSector(null)}
                        onSetRouteMode={(type) => setRouteMode({from: selectedSector, type})}
                    />
                )}
            </div>
        </div>
    );
};
