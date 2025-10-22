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
            { text: '"A deeper relationship."', nextId: 'crows-deeper-relationship' },
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
    'crows-deeper-relationship': {
        id: 'crows-deeper-relationship',
        speaker: 'Corvid Elder',
        art: '⬛',
        text: 'Intriguing. We value secrets. Information is our currency. Perhaps we can come to an... arrangement. A treaty of whispers.',
        options: [
             { text: 'Ask about the treaty.', nextId: 'crows-spy-treaty-offer' },
             { text: 'Nevermind.', nextId: null },
        ],
    },
    'crows-spy-treaty-offer': {
        id: 'crows-spy-treaty-offer',
        speaker: 'Corvid Elder',
        art: '⬛',
        text: 'Our network sees and hears all. For a price, we can disrupt your enemies from the shadows. This is our offer. Consider it.',
        options: [
             { text: 'Leave to consider.', nextId: null },
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

    // --- NEW MILESTONE DIALOGUES ---

    // --- RATS MILESTONES ---
    'rats-friendly-approach': {
        id: 'rats-friendly-approach',
        speaker: 'Rat Scavenger',
        art: '🐀',
        text: 'Squeak... Pope... The King is busy, but... we have a proposition. Good for you, good for us. Interested?',
        options: [
            { text: 'What is it?', nextId: 'rats-quest-offer' },
            { text: 'I don\'t deal with underlings.', nextId: null, effects: [{ type: 'WORSEN_RAT_RELATIONS', value: 5 }] },
        ],
    },
    'rats-quest-offer': {
        id: 'rats-quest-offer',
        speaker: 'Rat Scavenger',
        art: '🐀',
        text: 'The fat gulls guard the Bakery Rooftop. So much bread... We hear you are... persuasive. Get them to look the other way for a bit, and we\'ll give you a... finder\'s fee. 200 crumbs.',
        options: [
            { text: 'I\'ll see what I can do.', nextId: null, effects: [{ type: 'GAIN_CRUMBS', value: 200 }, { type: 'IMPROVE_RAT_RELATIONS', value: 15 }] }, // Simplified quest for now
            { text: 'I don\'t work for rats.', nextId: null, effects: [{ type: 'WORSEN_RAT_RELATIONS', value: 10 }] },
        ],
    },
    'rats-hostile-warning': {
        id: 'rats-hostile-warning',
        speaker: 'Rat King',
        art: '🐀',
        text: 'Your flock grows bold, Pope. They peck where they shouldn\'t. The alleys are OURS. Control your followers, or we\'ll... control them for you. Squeak.',
        options: [
            { text: 'My flock fears nothing.', nextId: null, effects: [{ type: 'WORSEN_RAT_RELATIONS', value: 10 }] },
            { text: 'A fair warning.', nextId: null },
        ],
    },

    // --- SEAGULLS MILESTONES ---
    'seagulls-notice-victory': {
        id: 'seagulls-notice-victory',
        speaker: 'Seagull Captain',
        art: '🐦',
        text: 'CAW! So the little pigeon has some fight in it. The rats are a nuisance. You did the sky a favor. Don\'t get cocky.',
        options: [
            { text: 'I\'m just getting started.', nextId: null, effects: [{ type: 'WORSEN_SEAGULL_RELATIONS', value: 5 }] },
            { text: 'They threatened my flock.', nextId: null, effects: [{ type: 'IMPROVE_SEAGULL_RELATIONS', value: 10 }] },
        ],
    },
    'seagulls-radio-tower-dispute': {
        id: 'seagulls-radio-tower-dispute',
        speaker: 'Seagull Captain',
        art: '🐦',
        text: 'That Radio Tower... that is the highest perch! It belongs to the Dominion! Your incessant cooing interferes with our... strategic sky-screaming! CAW!',
        options: [
            { text: 'Offer 100 crumbs as a "frequency tax".', nextId: null, effects: [{ type: 'LOSE_CRUMBS', value: 100 }, { type: 'IMPROVE_SEAGULL_RELATIONS', value: 20 }] },
            { text: 'The airwaves are for all.', nextId: null, effects: [{ type: 'WORSEN_SEAGULL_RELATIONS', value: 20 }] },
        ],
    },

    // --- CROWS MILESTONES ---
    'crows-relic-interest': {
        id: 'crows-relic-interest',
        speaker: 'Corvid Elder',
        art: '⬛',
        text: 'Your... collection... grows. Impressive. Relics hold stories. We trade in stories. Perhaps you would trade a story... for a secret?',
        options: [
            { text: 'What kind of secret?', nextId: 'crows-relic-trade-offer' },
            { text: 'My relics are sacred.', nextId: null, effects: [{ type: 'IMPROVE_CROW_RELATIONS', value: 5 }] }, // They respect this
        ],
    },
    'crows-relic-trade-offer': {
        id: 'crows-relic-trade-offer',
        speaker: 'Corvid Elder',
        art: '⬛',
        text: 'The location of a forgotten crumb hoard. A rival\'s weakness. The truth of the Golden Crumb. All have a price. For now, we simply wanted to gauge your interest. We will remember this.',
        options: [
            { text: 'I am intrigued.', nextId: null, effects: [{ type: 'IMPROVE_CROW_RELATIONS', value: 10 }] },
        ],
    },
    'crows-meme-confusion': {
        id: 'crows-meme-confusion',
        speaker: 'Corvid Elder',
        art: '⬛',
        text: 'We have observed your propaganda. It is... illogical. Images with text. It does not follow established patterns of persuasion, yet... the flock responds. We do not understand this "meme".',
        options: [
            { text: 'Attempt to explain it.', nextId: 'crows-meme-explanation' },
            { text: 'It is a holy mystery.', nextId: null },
        ],
    },
    'crows-meme-explanation': {
        id: 'crows-meme-explanation',
        speaker: 'Corvid Elder',
        art: '⬛',
        text: 'So... the absurdity is the point. Repetition combined with novelty... creating an internal language... Fascinating. A chaotic, but effective, form of dogma. You are more clever than you appear.',
        options: [
            { text: '(Nod wisely)', nextId: null, effects: [{ type: 'IMPROVE_CROW_RELATIONS', value: 15 }] },
        ],
    },
};