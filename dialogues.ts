// dialogues.ts
import type { DialogueNode } from './types';

export const DIALOGUES: { [id: string]: DialogueNode } = {
    'rats-intro': {
        id: 'rats-intro',
        speaker: 'Rat King',
        art: '🐀',
        text: 'Squeak! The Pigeon Pope... You encroach on our turf. What do you want, feather-duster?',
        options: [
            { text: 'Offer a tribute of 50 crumbs.', nextId: 'rats-tribute', effects: [{ type: 'LOSE_CRUMBS', value: 50 }] },
            { text: 'Threaten them.', nextId: 'rats-threaten' },
            { text: 'Leave.', nextId: null },
        ],
    },
    'rats-tribute': {
        id: 'rats-tribute',
        speaker: 'Rat King',
        art: '🐀',
        text: 'Hmph. A wise choice. We will tolerate your presence... for now. Squeak!',
        options: [
            { text: 'Leave in peace.', nextId: null, effects: [{ type: 'IMPROVE_RAT_RELATIONS', value: 20 }] },
        ],
    },
    'rats-threaten': {
        id: 'rats-threaten',
        speaker: 'Rat King',
        art: '🐀',
        text: 'You dare?! The alleys will run red with... feathers! Prepare for war!',
        options: [
            { text: 'Flee!', nextId: null, effects: [{ type: 'WORSEN_RAT_RELATIONS', value: 40 }] },
        ],
    },
    'seagulls-intro': {
        id: 'seagulls-intro',
        speaker: 'Seagull Captain',
        art: '🐦',
        text: 'CAW! Look what the wind blew in. This is OUR sky, little pigeon. State your business or be gone.',
        options: [
            { text: '"I come in peace."', nextId: 'seagulls-peace' },
            { text: '"This sky belongs to everyone."', nextId: 'seagulls-challenge' },
            { text: 'Leave.', nextId: null },
        ]
    },
    'seagulls-peace': {
        id: 'seagulls-peace',
        speaker: 'Seagull Captain',
        art: '🐦',
        text: '"Peace"? An interesting concept. We will watch you. Do not cross us. CAW!',
        options: [
            { text: 'Nod respectfully and leave.', nextId: null, effects: [{ type: 'IMPROVE_SEAGULL_RELATIONS', value: 5 }] },
        ],
    },
    'seagulls-challenge': {
        id: 'seagulls-challenge',
        speaker: 'Seagull Captain',
        art: '🐦',
        text: 'Bold words for a glorified street-sweeper. You have made an enemy today. CAW!',
        options: [
            { text: 'Stare them down and leave.', nextId: null, effects: [{ type: 'WORSEN_SEAGULL_RELATIONS', value: 20 }] },
        ],
    },
    'crows-intro': {
        id: 'crows-intro',
        speaker: 'Corvid Elder',
        art: '⬛',
        text: '...We have been observing. Your... faith... is a curiosity. What is it you truly seek?',
        options: [
            { text: '"Knowledge and shiny things."', nextId: 'crows-knowledge' },
            { text: '"Power and dominion."', nextId: 'crows-power' },
            { text: 'Remain silent.', nextId: null },
        ],
    },
    'crows-knowledge': {
        id: 'crows-knowledge',
        speaker: 'Corvid Elder',
        art: '⬛',
        text: 'A worthy pursuit. We may have interests in common. Go now, we will continue to watch.',
        options: [
             { text: 'Leave.', nextId: null, effects: [{ type: 'IMPROVE_CROW_RELATIONS', value: 15 }] },
        ],
    },
     'crows-power': {
        id: 'crows-power',
        speaker: 'Corvid Elder',
        art: '⬛',
        text: 'A predictable and boring desire. You are no different from the gulls. Leave our sight.',
        options: [
             { text: 'Leave.', nextId: null, effects: [{ type: 'WORSEN_CROW_RELATIONS', value: 15 }] },
        ],
    },
};
