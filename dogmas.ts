// dogmas.ts
import type { Dogma } from './types';

export const DOGMAS: { [id: string]: Dogma } = {
    'dogma-bread-body': {
        id: 'dogma-bread-body',
        name: 'Dogma of the Bread as Body',
        description: 'Every crumb is a fragment of the divine. All crumb gains are increased by 15%.',
        art: '🍞✨',
        effect: { type: 'CRUMB_GAIN_MULTIPLIER', value: 1.15 }
    },
    'dogma-iron-wing': {
        id: 'dogma-iron-wing',
        name: 'Dogma of the Iron Wing',
        description: 'The flock is a weapon. Conflict cards deal 25% more damage.',
        art: '💥💪',
        effect: { type: 'CONFLICT_DAMAGE_MULTIPLIER', value: 1.25 }
    },
    'dogma-endless-coo': {
        id: 'dogma-endless-coo',
        name: 'Dogma of the Endless Coo',
        description: 'Faith is eternal and self-sustaining. Gain +0.5 Faith per second.',
        art: '🗣️🎶',
        effect: { type: 'PASSIVE_FAITH_GAIN', value: 0.5 }
    }
};