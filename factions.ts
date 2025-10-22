// factions.ts
import type { Faction, Boss } from './types';
import { initialDeck } from './constants';

export const FACTIONS: { [id: string]: Faction } = {
    'rats': {
        id: 'rats',
        name: 'The Gutter Rat Syndicate',
        description: 'Filthy, numerous, and masters of the alleyways. They value crumbs above all else.',
        art: '🐀',
        relationship: -50,
        isHostileByDefault: true,
        power: 100,
        dialogueId: 'rats-intro',
    },
    'seagulls': {
        id: 'seagulls',
        name: 'The Coastal Seagull Dominion',
        description: 'Arrogant tyrants of the sky and sea. They are aggressive and territorial.',
        art: '🐦',
        relationship: -20,
        isHostileByDefault: false,
        power: 150,
        dialogueId: 'seagulls-intro',
    },
    'crows': {
        id: 'crows',
        name: 'The Corvid Collective',
        description: 'Intelligent, mysterious, and obsessed with shiny objects. They can be powerful allies or cunning foes.',
        art: '⬛',
        relationship: 0,
        isHostileByDefault: false,
        power: 120,
        dialogueId: 'crows-intro',
    }
};

export const SEAGULL_BOSS: Boss = {
    name: "Gulliver, the Sky Tyrant",
    faith: 250,
    heresyPerSecond: 1.5,
    hand: [],
    deck: initialDeck,
    lastActionTimestamp: 0,
    isBoss: true,
    art: '👑🐦',
    specialAbilities: [
        { id: 'sky-dive', name: 'Sky Dive Peck', description: 'A devastating attack from above.', cooldown: 5, lastUsed: 0 },
        { id: 'gale-force', name: 'Gale Force Wings', description: 'Blows a card from the player\'s hand.', cooldown: 8, lastUsed: 0 },
    ],
};
