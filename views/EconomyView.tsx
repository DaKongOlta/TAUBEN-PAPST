import React from 'react';
import type { Building } from '../types';
import { ResourceType } from '../types';
import { CrumbIcon, FaithIcon } from '../components/icons';
import { getBuildingUpgradeCost } from '../utils';
import { Tooltip } from '../components/Tooltip';

interface EconomyViewProps {
  buildings: Building[];
  onUpgrade: (buildingId: string) => void;
  currentFaith: number;
  currentCrumbs: number;
  inflation: number;
}

const BuildingCard: React.FC<{
  building: Building;
  onUpgrade: (buildingId: string) => void;
  canAfford: (cost: number, resource: ResourceType) => boolean;
  inflatedCost: number;
}> = ({ building, onUpgrade, canAfford, inflatedCost }) => {
  const { level, costResource } = building;
  const production = building.baseProduction * level;
  const canCurrentlyAfford = canAfford(inflatedCost, costResource);

  const tooltipContent = canCurrentlyAfford
    ? `Upgrade for ${inflatedCost} ${costResource}`
    : `Not enough ${costResource}. Required: ${inflatedCost}`;

  return (
    <div className="bg-stone-800/50 p-4 rounded-lg border border-stone-700 flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <div className="text-5xl mt-1">{building.art}</div>
        <div>
          <h4 className="font-bold text-lg font-silkscreen text-amber-200">{building.name}</h4>
          <p className="text-xs text-stone-400">{building.description}</p>
        </div>
      </div>
      <div className="flex-grow space-y-2 text-sm bg-black/20 p-2 rounded-md">
        <div className="flex justify-between">
          <span className="font-bold text-stone-300">Level:</span>
          <span className="font-bold text-amber-300">{level}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold text-stone-300">Production:</span>
          <span className="font-bold text-green-400">
            {production.toFixed(1)} {building.productionType}/s
          </span>
        </div>
      </div>
      <Tooltip content={tooltipContent} position="top" className="w-full mt-auto">
        <button
          onClick={() => onUpgrade(building.id)}
          disabled={!canCurrentlyAfford}
          className="w-full p-3 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-600 disabled:cursor-not-allowed rounded-lg text-white font-silkscreen text-md transition-colors"
        >
          <div className="flex flex-col items-center">
              <span>{level === 0 ? 'Build' : 'Upgrade'}</span>
              <div className="flex items-center justify-center gap-1 text-xs opacity-80">
                  <span>Cost: {inflatedCost}</span>
                  {costResource === ResourceType.Faith ? <FaithIcon className="w-3 h-3"/> : <CrumbIcon className="w-3 h-3"/>}
              </div>
          </div>
        </button>
      </Tooltip>
    </div>
  );
};


export const EconomyView: React.FC<EconomyViewProps> = ({ buildings, onUpgrade, currentFaith, currentCrumbs, inflation }) => {
    const canAfford = (cost: number, resource: ResourceType) => {
        return resource === ResourceType.Faith ? currentFaith >= cost : currentCrumbs >= cost;
    };

    return (
    <div className="p-6 h-full overflow-y-auto">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-4xl font-silkscreen text-amber-300 mb-2">Economy Management</h2>
                <p className="text-stone-400 mb-6">Construct and upgrade buildings to automate your holy empire.</p>
            </div>
            <div className="text-right">
                <div className="text-lg font-bold text-red-300">Inflation: x{inflation.toFixed(3)}</div>
                <p className="text-xs text-stone-400">All costs are increased by this amount.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {buildings.map(b => {
            const cost = getBuildingUpgradeCost(b);
            const inflatedCost = Math.ceil(cost * inflation);
            return (
                <BuildingCard key={b.id} building={b} onUpgrade={onUpgrade} canAfford={canAfford} inflatedCost={inflatedCost} />
            )
          })}
        </div>

        <div className="mt-8 pt-6 border-t-2 border-stone-700 text-center">
            <h3 className="text-2xl font-silkscreen text-amber-300 mb-2">Advanced Economy</h3>
            <div className="flex justify-center gap-4">
                <button disabled className="px-6 py-3 bg-purple-800 text-white font-bold rounded-lg opacity-50 cursor-not-allowed">
                    Relic Market (Coming Soon)
                </button>
                 <button disabled className="px-6 py-3 bg-stone-700 text-white font-bold rounded-lg opacity-50 cursor-not-allowed">
                    Leaderboards (Coming Soon)
                </button>
            </div>
        </div>
      </div>
    );
};
