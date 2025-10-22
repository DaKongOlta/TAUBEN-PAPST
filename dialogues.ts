// dialogues.ts
import type { DialogueNode } from './types';

export const DIALOGUES: { [id: string]: DialogueNode } = {
    // Player-initiated dialogues
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

    // AI-initiated dialogues
    'seagulls-declare-rivalry': {
        id: 'seagulls-declare-rivalry',
        speaker: 'Seagull Captain',
        art: '🐦',
        text: 'CAW! You expand too far, Pope! Your ambition will be your undoing. We now consider you a rival. The skies will not be safe for you.',
        options: [{ text: 'So be it.', nextId: null }],
    },
    'rats-demand-crumbs': {
        id: 'rats-demand-crumbs',
        speaker: 'Rat King',
        art: '🐀',
        text: 'Squeak! Your hoard grows large, Pope. Too large. The Syndicate demands a "tax" of 100 crumbs to ensure... safety.',
        options: [
            { text: 'Pay the tax. (Lose 100 Crumbs)', nextId: null, effects: [{ type: 'LOSE_CRUMBS', value: 100 }, { type: 'IMPROVE_RAT_RELATIONS', value: 10 }] },
            { text: 'Refuse.', nextId: null, effects: [{ type: 'WORSEN_RAT_RELATIONS', value: 25 }] },
        ],
    },
    'crows-offer-info': {
        id: 'crows-offer-info',
        speaker: 'Corvid Elder',
        art: '⬛',
        text: 'Your collection of trinkets is... impressive. We appreciate such things. Know this: the Seagulls watch the Bakery Rooftop with great interest. A valuable perch.',
        options: [{ text: 'Thank you for the information.', nextId: null }],
    },
    'rats-declare-alliance': {
        id: 'rats-declare-alliance',
        speaker: 'Rat King',
        art: '🐀',
        text: 'Squeak! Your influence is undeniable, and your tributes... acceptable. The Syndicate sees your value. We are allies now. Don\'t betray us.',
        options: [{ text: 'An honor to the Syndicate.', nextId: null }],
    },
    'seagulls-declare-alliance': {
        id: 'seagulls-declare-alliance',
        speaker: 'Seagull Captain',
        art: '🐦',
        text: 'CAW! You have proven your strength, Pope. The Dominion will fly alongside you... for now. We are allies.',
        options: [{ text: 'Together, we rule the skies.', nextId: null }],
    },
    'crows-declare-alliance': {
        id: 'crows-declare-alliance',
        speaker: 'Corvid Elder',
        art: '⬛',
        text: 'Your path aligns with our interests. The Collective will formally aid your flock. We are allies.',
        options: [{ text: 'I appreciate your wisdom.', nextId: null }],
    },
};