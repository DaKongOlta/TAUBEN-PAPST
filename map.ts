import type { MapSector } from './types';
import { ResourceType } from './types';

export const MAP_DATA: MapSector[] = [
    {
        id: 'sector-0',
        name: 'Home Roost',
        art: '🏠',
        description: 'Your starting perch. Humble, but full of potential.',
        isUnlocked: true,
        isExplored: true,
        resources: { [ResourceType.Crumbs]: 5 },
        rivalPresence: 0,
    },
    {
        id: 'sector-1',
        name: 'Town Square Fountain',
        art: '⛲',
        description: 'A place of public gathering and discarded snacks.',
        isUnlocked: false,
        isExplored: false,
        resources: { [ResourceType.Crumbs]: 10, [ResourceType.Faith]: 2 },
        rivalPresence: 20,
    },
    {
        id: 'sector-2',
        name: 'Bakery Rooftop',
        art: '🥐',
        description: 'The intoxicating aroma of baking bread strengthens belief.',
        isUnlocked: false,
        isExplored: false,
        resources: { [ResourceType.Crumbs]: 15 },
        rivalPresence: 10,
    },
    {
        id: 'sector-3',
        name: 'Gloomy Alleyway',
        art: ' alley  alley oop',
        description: 'A dark and dangerous place, rumored to be a den of heresy.',
        isUnlocked: false,
        isExplored: false,
        resources: {},
        rivalPresence: 50,
    }
];
