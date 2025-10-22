// utils.ts
import type { Building } from './types';

/**
 * Calculates the cost for the next upgrade of a building.
 * @param building The building object.
 * @returns The numerical cost for the next upgrade.
 */
export const getBuildingUpgradeCost = (building: Building): number => {
    return Math.floor(building.baseCost * Math.pow(building.costMultiplier, building.level));
};
