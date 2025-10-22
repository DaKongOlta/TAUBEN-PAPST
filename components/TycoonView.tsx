import React from 'react';
import type { Building } from '../types';
import { ResourceType } from '../types';
import { CrumbIcon, FaithIcon } from './icons';

interface TycoonViewProps {
  buildings: Building[];
  onUpgrade: (buildingId: string) => void;
  onClose: () => void;
  currentFaith: number;
  currentCrumbs: number;
}

const BuildingCard: React.FC<{
  building: Building;
  onUpgrade: (buildingId: string) => void;
  canAfford: (cost: number, resource: ResourceType) => boolean;
}> = ({ building, onUpgrade, canAfford }) => {
  const { level, baseCost, costMultiplier, costResource } = building;
  const cost = Math.floor(baseCost * Math.pow(costMultiplier, level));
  const production = building.baseProduction * level;
  const canCurrentlyAfford = canAfford(cost, costResource);

  return (
    <div className="bg-stone-900/80 p-4 rounded-lg border border-stone-700 flex flex-col gap-2">
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
      <button
        onClick={() => onUpgrade(building.id)}
        disabled={!canCurrentlyAfford}
        className="w-full mt-auto p-3 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-600 disabled:cursor-not-allowed rounded-lg text-white font-silkscreen text-md transition-colors"
      >
        <div className="flex flex-col items-center">
            <span>{level === 0 ? 'Build' : 'Upgrade'}</span>
            <div className="flex items-center justify-center gap-1 text-xs opacity-80">
                <span>Cost: {cost}</span>
                {costResource === ResourceType.Faith ? <FaithIcon className="w-3 h-3"/> : <CrumbIcon className="w-3 h-3"/>}
            </div>
        </div>
      </button>
    </div>
  );
};


export const TycoonView: React.FC<TycoonViewProps> = ({ buildings, onUpgrade, onClose, currentFaith, currentCrumbs }) => {
    const canAfford = (cost: number, resource: ResourceType) => {
        return resource === ResourceType.Faith ? currentFaith >= cost : currentCrumbs >= cost;
    };

    return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-stone-800 border-4 border-amber-300/50 rounded-lg max-w-4xl w-full p-6 text-center animate-fade-in relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl px-3 py-1 rounded-full bg-red-600 hover:bg-red-500 font-bold">&times;</button>
        <h2 className="text-4xl font-silkscreen text-amber-300 mb-1">Tycoon Management</h2>
        <p className="text-stone-400 mb-6">Construct and upgrade buildings to automate your holy empire.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buildings.map(b => (
            <BuildingCard key={b.id} building={b} onUpgrade={onUpgrade} canAfford={canAfford} />
          ))}
        </div>
      </div>
    </div>
    );
};
