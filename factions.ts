// factions.ts
import type { Faction, Boss, RivalSect, Treaty } from './types';
import { initialDeck } from './constants';
import { ResourceType } from './types';

const RAT_TREATIES: Treaty[] = [
    {
        id: 'treaty-rats-01',
        name: 'Crumb Scavenging Pact',
        description: 'The rats share their secret scrounging routes. Increases crumb production from followers by 15%.',
        effect: { type: 'FOLLOWER_CRUMB_PRODUCTION_MULTIPLIER', value: 0.15 },
        isActive: false,
    }
];

const SEAGULL_TREATIES: Treaty[] = [
    {
        id: 'treaty-gulls-01',
        name: 'Sky Patrol Treaty',
        description: 'The seagulls agree to not interfere with your sermons. Increases all Faith generation by 10%.',
        effect: { type: 'FAITH_GAIN_MULTIPLIER', value: 0.10 },
        isActive: false,
    }
];

const CROW_TREATIES: Treaty[] = [
     {
        id: 'treaty-crows-01',
        name: 'Shared Hoard',
        description: 'The crows contribute a few shiny things... which turn out to be crumbs. Passively grants +0.2 crumbs/sec.',
        effect: { type: 'CRUMB_GAIN_ADD', value: 0.2 },
        isActive: false,
    }
];


export const FACTIONS: { [id: string]: Faction } = {
    'rats': {
        id: 'rats',
        name: 'The Gutter Rat Syndicate',
        description: 'Filthy, numerous, and masters of the alleyways. They value crumbs above all else.',
        art: '🐀',
        relationship: -50,
        diplomaticStatus: 'Neutral',
        isHostileByDefault: true,
        power: 100,
        dialogueId: 'rats-intro',
        treaties: RAT_TREATIES,
        allianceBonus: { type: 'FOLLOWER_CRUMB_PRODUCTION_MULTIPLIER', value: 0.20 }
    },
    'seagulls': {
        id: 'seagulls',
        name: 'The Coastal Seagull Dominion',
        description: 'Arrogant tyrants of the sky and sea. They are aggressive and territorial.',
        art: '🐦',
        relationship: -20,
        diplomaticStatus: 'Neutral',
        isHostileByDefault: false,
        power: 150,
        dialogueId: 'seagulls-intro',
        treaties: SEAGULL_TREATIES,
        allianceBonus: { type: 'GLOBAL_COMBAT_DAMAGE_MULTIPLIER', value: 1.15 }
    },
    'crows': {
        id: 'crows',
        name: 'The Corvid Collective',
        description: 'Intelligent, mysterious, and obsessed with shiny objects. They can be powerful allies or cunning foes.',
        art: '⬛',
        relationship: 0,
        diplomaticStatus: 'Neutral',
        isHostileByDefault: false,
        power: 120,
        dialogueId: 'crows-intro',
        treaties: CROW_TREATIES,
        allianceBonus: { type: 'GLOBAL_XP_GAIN_MULTIPLIER', value: 1.10 }
    }
};

export const CORVID_RIVAL: RivalSect = {
    name: 'The Corvid Collective',
    faith: 120,
    heresyPerSecond: 0.5,
    hand: [],
    deck: [],
    lastActionTimestamp: 0,
    buffs: [],
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
    buffs: [],
};