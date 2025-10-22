// factionAI.ts
import type { GameState, FactionAIAction } from './types';

// --- AI Tuning Parameters ---

// The chance per tick that a faction will act if its conditions are met. (Tuned for more natural pacing)
const AI_ACTION_PROBABILITY = {
    SEAGULLS: 0.15, // 15% chance
    RATS: 0.20,     // 20% chance
    CROWS: 0.33,    // 33% chance, but has a narrow trigger window
    ALLIANCE: 0.25, // 25% chance to propose alliance if conditions met
};

// Seagulls become hostile if player power exceeds a ratio of their own. (Tuned for slightly later aggression)
const SEAGULL_POWER_THRESHOLD_RATIO = 0.8; // Player power > 80% of Seagull power
const SEAGULL_TERRITORY_THRESHOLD = 5; // Player must have unlocked at least 5 sectors
const SEAGULL_RELATIONSHIP_THRESHOLD = -15; // Relationship must be negative

// Rats demand tribute if player's crumb hoard is large. (Tuned to be less punishing early on)
// The threshold scales with the number of followers.
const RATS_CRUMB_HOARD_BASE = 200;
const RATS_CRUMB_HOARD_PER_FOLLOWER = 20;
const RATS_RELATIONSHIP_THRESHOLD = -20;

// Crows offer information if the player has relics and is in good standing. (Tuned to be more special)
// This triggers only within a specific relationship window to feel like a unique event.
const CROW_RELIC_THRESHOLD = 2;
const CROW_RELATIONSHIP_WINDOW_MIN = 30;
const CROW_RELATIONSHIP_WINDOW_MAX = 70;

// Alliance threshold (Remains high to be a significant achievement)
const ALLIANCE_RELATIONSHIP_THRESHOLD = 80;


/**
 * Runs the AI logic for all factions based on the current game state.
 * @param gameState A snapshot of the current game state.
 * @returns An array of actions for the game to execute.
 */
export const runFactionAI = (gameState: GameState): FactionAIAction[] => {
    const actions: FactionAIAction[] = [];
    
    // A more comprehensive measure of player's influence.
    const playerPower = (gameState.playerStats.level * 5) + 
                        (gameState.followers.length * 2) + 
                        (gameState.sectors.filter(s => s.isUnlocked).length * 3);
    const playerTerritory = gameState.sectors.filter(s => s.isUnlocked).length;

    for (const faction of Object.values(gameState.factions)) {
        // AI only considers actions if the faction is currently neutral.
        // This prevents spamming and allows for periods of stability or defined conflict.
        if (faction.diplomaticStatus !== 'Neutral') {
            continue;
        }

        // Check for potential Alliance formation
        if (
            faction.relationship >= ALLIANCE_RELATIONSHIP_THRESHOLD &&
            faction.treaties.some(t => t.isActive) &&
            Math.random() < AI_ACTION_PROBABILITY.ALLIANCE
        ) {
            actions.push({
                type: 'UPDATE_FACTION_STATUS',
                payload: { factionId: faction.id, status: 'Alliance' }
            });
            actions.push({
                type: 'ADD_INCOMING_MESSAGE',
                payload: { dialogueId: `${faction.id}-declare-alliance` }
            });
            // If an alliance is formed, skip other actions for this faction on this tick
            continue; 
        }


        switch (faction.id) {
            case 'seagulls':
                const powerThreshold = faction.power * SEAGULL_POWER_THRESHOLD_RATIO;
                // AGGRESSIVE AI: If player gets too strong and is disliked, the seagulls see them as a threat.
                if (
                    playerPower > powerThreshold &&
                    playerTerritory >= SEAGULL_TERRITORY_THRESHOLD &&
                    faction.relationship < SEAGULL_RELATIONSHIP_THRESHOLD &&
                    Math.random() < AI_ACTION_PROBABILITY.SEAGULLS
                ) {
                    actions.push({
                        type: 'UPDATE_FACTION_STATUS',
                        payload: { factionId: 'seagulls', status: 'Rivalry' }
                    });
                    actions.push({
                        type: 'ADD_INCOMING_MESSAGE',
                        payload: { dialogueId: 'seagulls-declare-rivalry' }
                    });
                }
                break;
            
            case 'rats':
                const crumbThreshold = RATS_CRUMB_HOARD_BASE + (gameState.followers.length * RATS_CRUMB_HOARD_PER_FOLLOWER);
                // OPPORTUNISTIC AI: If player is rich and disliked, the rats see an opportunity for extortion.
                if (
                    gameState.crumbs > crumbThreshold &&
                    faction.relationship < RATS_RELATIONSHIP_THRESHOLD &&
                    Math.random() < AI_ACTION_PROBABILITY.RATS
                ) {
                    actions.push({
                        type: 'ADD_INCOMING_MESSAGE',
                        payload: { dialogueId: 'rats-demand-crumbs' }
                    });
                }
                break;
            
            case 'crows':
                // CURIOUS & SECRETIVE AI: If player proves themselves by finding relics and earning some trust,
                // the crows may have interests in common.
                if (
                    gameState.relics.length >= CROW_RELIC_THRESHOLD &&
                    faction.relationship > CROW_RELATIONSHIP_WINDOW_MIN &&
                    faction.relationship < CROW_RELATIONSHIP_WINDOW_MAX &&
                    Math.random() < AI_ACTION_PROBABILITY.CROWS
                ) {
                    actions.push({
                        type: 'ADD_INCOMING_MESSAGE',
                        payload: { dialogueId: 'crows-offer-info' }
                    });
                    // By not changing their status, we allow for future interactions. The relationship window
                    // and the fact that relationship will likely increase after this dialogue, naturally prevents spam.
                }
                break;
        }
    }

    return actions;
};