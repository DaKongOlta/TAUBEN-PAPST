import type { StreamDeckAction } from './types';
import { ALL_CARDS, TYCOON_BUILDINGS } from './constants';
import { ResourceType } from './types';

export const getAvailableStreamDeckActions = (): StreamDeckAction[] => {
    const actions: StreamDeckAction[] = [];

    // Basic Actions
    actions.push({ type: 'BASIC_ACTION', label: 'Pray for Faith', icon: '🙏', payload: { actionName: 'Pray' } });
    actions.push({ type: 'BASIC_ACTION', label: 'Scrounge Crumbs', icon: '🧐', payload: { actionName: 'Scrounge' } });

    // Resource Display
    actions.push({ type: 'SHOW_RESOURCE', label: 'Show Faith', icon: '🙏', payload: { resource: ResourceType.Faith } });
    actions.push({ type: 'SHOW_RESOURCE', label: 'Show Crumbs', icon: '🍞', payload: { resource: ResourceType.Crumbs } });
    actions.push({ type: 'SHOW_RESOURCE', label: 'Show Followers', icon: '🕊️', payload: { resource: 'Followers' } });

    // Cards
    for (const cardId in ALL_CARDS) {
        const card = ALL_CARDS[cardId];
        actions.push({ type: 'PLAY_CARD', label: `Play: ${card.name}`, icon: card.art, payload: { id: card.id } });
    }

    // Buildings
    TYCOON_BUILDINGS.forEach(building => {
        actions.push({ type: 'UPGRADE_BUILDING', label: `Upgrade: ${building.name}`, icon: building.art, payload: { id: building.id } });
    });

    return actions;
};