// relics.ts
import type { Relic, LootBox, GameEffect } from './types';

export const RELICS: Record<string, Relic> = {
    'relic-001': {
        id: 'relic-001',
        name: 'Golden Crumb',
        art: '🏆',
        description: 'A crumb so pure it seems to multiply on its own. Passively grants +0.5 crumbs/sec.',
        effect: { type: 'CRUMB_GAIN_ADD', value: 0.5 }
    },
    'relic-002': {
        id: 'relic-002',
        name: 'Everlasting Feather',
        art: '🪶',
        description: 'A feather that never tarnishes. The flock feels constantly reassured. Passively grants +0.1 morale/sec.',
        effect: { type: 'MORALE_GAIN_ADD', value: 0.1 }
    },
    'relic-003': {
        id: 'relic-003',
        name: 'Four-Leaf Clover',
        art: '🍀',
        description: 'An unnaturally lucky clover, pecked from a forgotten lawn. Grants +10 Luck.',
        effect: { type: 'LUCK_ADD', value: 10 }
    }
};

export const LOOT_BOXES: Record<string, LootBox> = {
    'coocoo_crate': {
        id: 'coocoo_crate',
        name: 'Coo-coo Crate',
        art: '🥚',
        description: 'A mysterious, shimmering egg. Click to open it!',
    }
};

interface LootTableEntry {
    weight: number;
    result: GameEffect[];
}

const COOCCOO_CRATE_LOOT_TABLE: LootTableEntry[] = [
    { weight: 30, result: [{ type: 'GAIN_CRUMBS', value: 50 }] },
    { weight: 30, result: [{ type: 'GAIN_FAITH', value: 40 }] },
    { weight: 15, result: [{ type: 'GAIN_XP', value: 30 }] },
    { weight: 10, result: [{ type: 'GAIN_CRUMBS', value: 150 }] },
    { weight: 8, result: [{ type: 'GAIN_RELIC', value: 'relic-001' }] },
    { weight: 5, result: [{ type: 'GAIN_RELIC', value: 'relic-003' }] },
    { weight: 2, result: [{ type: 'GAIN_RELIC', value: 'relic-002' }, {type: 'GAIN_XP', value: 50 }] },
];

export function openLootBox(id: string): GameEffect[] {
    if (id !== 'coocoo_crate') return [];

    const totalWeight = COOCCOO_CRATE_LOOT_TABLE.reduce((sum, entry) => sum + entry.weight, 0);
    let random = Math.random() * totalWeight;

    for (const entry of COOCCOO_CRATE_LOOT_TABLE) {
        if (random < entry.weight) {
            return entry.result;
        }
        random -= entry.weight;
    }

    return COOCCOO_CRATE_LOOT_TABLE[0].result; // Fallback
}
