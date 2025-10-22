import type { MapEventDefinition, MapSector } from './types';

export const MAP_EVENTS: Record<string, MapEventDefinition> = {
    'seagull-swarm': {
        id: 'seagull-swarm',
        name: 'Seagull Swarm',
        description: 'A menacing flock of seagulls descends on a district, halting all production and scaring the locals.',
        art: '🐦',
        duration: 60,
        applyEffect: (sectors: MapSector[]) => {
            const targetableSectors = sectors.filter(s => s.isUnlocked);
            if (targetableSectors.length === 0) return sectors;
            
            const targetIndex = Math.floor(Math.random() * targetableSectors.length);
            const targetSectorId = targetableSectors[targetIndex].id;

            return sectors.map(s => s.id === targetSectorId 
                ? { ...s, activeEvent: { id: 'seagull-swarm', name: 'Seagull Swarm', art: '🐦' } } 
                : s
            );
        },
    },
    'divine-rain': {
        id: 'divine-rain',
        name: 'Divine Rain',
        description: 'A blessed rain of crumbs falls upon a district, temporarily boosting its Faith output.',
        art: '🌧️',
        duration: 90,
        applyEffect: (sectors: MapSector[]) => {
            const targetableSectors = sectors.filter(s => s.isUnlocked);
            if (targetableSectors.length === 0) return sectors;
            
            const targetIndex = Math.floor(Math.random() * targetableSectors.length);
            const targetSectorId = targetableSectors[targetIndex].id;

            return sectors.map(s => s.id === targetSectorId 
                ? { ...s, activeEvent: { id: 'divine-rain', name: 'Divine Rain', art: '🌧️' } } 
                : s
            );
        },
    }
};

export const LOAF_INFLATION_CRISIS = {
    id: 'loaf-inflation',
    name: 'Loaf Inflation Crisis',
    description: 'The value of crumbs plummets city-wide! All crumb costs are doubled.',
    duration: 120,
};
