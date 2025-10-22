import type { Skill } from './types';

export const SKILLS_DATA: Record<string, Skill> = {
    // --- AUTOMATION TREE ---
    'auto-1': {
        id: 'auto-1',
        name: 'Crumb Efficiency',
        description: 'Followers produce 10% more crumbs.',
        art: '🍞+',
        tree: 'Automation',
        cost: 1,
        unlocked: false,
        dependencies: [],
        position: { row: 1, col: 1 },
    },
    'auto-2': {
        id: 'auto-2',
        name: 'Faithful Automation',
        description: 'Buildings produce 10% more faith.',
        art: '🙏+',
        tree: 'Automation',
        cost: 2,
        unlocked: false,
        dependencies: ['auto-1'],
        position: { row: 2, col: 1 },
    },

    // --- PROPAGANDA TREE ---
    'prop-1': {
        id: 'prop-1',
        name: 'Inspiring Coo',
        description: 'Sermon cards have a 10% chance to attract an extra follower.',
        art: '🗣️+',
        tree: 'Propaganda',
        cost: 1,
        unlocked: false,
        dependencies: [],
        position: { row: 1, col: 1 },
    },
    'prop-2': {
        id: 'prop-2',
        name: 'Morale Boost',
        description: 'Blessing cards are 20% more effective.',
        art: '✨+',
        tree: 'Propaganda',
        cost: 2,
        unlocked: false,
        dependencies: ['prop-1'],
        position: { row: 2, col: 1 },
    },

    // --- COMBAT TREE ---
    'combat-1': {
        id: 'combat-1',
        name: 'Righteous Fury',
        description: 'Righteous Peck cards deal +2 damage.',
        art: '💥+',
        tree: 'Combat',
        cost: 1,
        unlocked: false,
        dependencies: [],
        position: { row: 1, col: 1 },
    },

    // --- MEMES TREE ---
    'memes-1': {
        id: 'memes-1',
        name: 'Confusing Meme',
        description: 'Temporarily lowers rival heresy generation.',
        art: '😂',
        tree: 'Memes',
        cost: 1,
        unlocked: false,
        dependencies: [],
        position: { row: 1, col: 1 },
        cooldown: 60,
    },
};
