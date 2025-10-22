import React, { useState, useMemo } from 'react';
import type { StreamDeckAction } from '../types';
import { ResourceType } from '../types';
import { getAvailableStreamDeckActions } from '../streamDeckActions';
import { playSound } from '../audioManager';

const DraggableAction: React.FC<{ action: StreamDeckAction, onDragStart: (e: React.DragEvent, action: StreamDeckAction) => void }> = ({ action, onDragStart }) => (
    <div
        draggable
        onDragStart={e => onDragStart(e, action)}
        className="draggable-action flex items-center gap-2 text-white"
    >
        <span className="text-xl">{action.icon}</span>
        <span>{action.label}</span>
    </div>
);

const StreamDeckKey: React.FC<{
    config: StreamDeckAction | null;
    onDrop: (e: React.DragEvent) => void;
    onClick: () => void;
    onClear: () => void;
    resourceValues: Record<string, number>;
}> = ({ config, onDrop, onClick, onClear, resourceValues }) => {
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = () => setIsDraggingOver(false);
    
    const handleDrop = (e: React.DragEvent) => {
        onDrop(e);
        setIsDraggingOver(false);
    };

    const renderContent = () => {
        if (!config) return <div className="key-content text-stone-600 font-bold text-xs">Empty</div>;
        
        if (config.type === 'SHOW_RESOURCE') {
            const resourceKey = config.payload.resource || '';
            const value = resourceValues[resourceKey.toLowerCase() as keyof typeof resourceValues] ?? 0;
            return (
                <div className="key-content">
                    <span className="key-icon">{config.icon}</span>
                    <span className="key-value">{value.toFixed(0)}</span>
                </div>
            );
        }

        return (
            <div className="key-content">
                <span className="key-icon">{config.icon}</span>
                <span className="key-label">{config.label}</span>
            </div>
        );
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={onClick}
            className={`stream-deck-key ${config ? 'configured' : ''} ${isDraggingOver ? 'dragging-over' : ''}`}
        >
            {renderContent()}
            {config && <button onClick={(e) => { e.stopPropagation(); onClear(); }} className="clear-key-btn">×</button>}
        </div>
    );
};

interface IntegrationsViewProps {
    streamDeckConfig: Array<StreamDeckAction | null>;
    onSetKey: (keyIndex: number, action: StreamDeckAction | null) => void;
    onTriggerAction: (action: StreamDeckAction) => void;
    resourceValues: { faith: number; crumbs: number; followers: number; divineFavor: number };
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({ streamDeckConfig, onSetKey, onTriggerAction, resourceValues }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Not Connected');
    const availableActions = useMemo(() => getAvailableStreamDeckActions(), []);

    const handleConnect = () => {
        setStatusMessage('Connecting...');
        playSound('ui_click');
        setTimeout(() => {
            setIsConnected(true);
            setStatusMessage('Stream Deck Connected');
            playSound('upgrade');
        }, 1500);
    };
    
    const handleDragStart = (e: React.DragEvent, action: StreamDeckAction) => {
        e.dataTransfer.setData('application/json', JSON.stringify(action));
    };

    const handleDropOnKey = (e: React.DragEvent, keyIndex: number) => {
        const actionJSON = e.dataTransfer.getData('application/json');
        if (actionJSON) {
            const action = JSON.parse(actionJSON) as StreamDeckAction;
            onSetKey(keyIndex, action);
        }
    };
    
    const actionCategories = {
        'Basic': availableActions.filter(a => a.type === 'BASIC_ACTION'),
        'Displays': availableActions.filter(a => a.type === 'SHOW_RESOURCE'),
        'Cards': availableActions.filter(a => a.type === 'PLAY_CARD'),
        'Buildings': availableActions.filter(a => a.type === 'UPGRADE_BUILDING'),
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <h2 className="text-4xl font-silkscreen text-amber-300 mb-2">Integrations</h2>
            <p className="text-stone-400 mb-6">Connect and configure external devices like the Elgato Stream Deck.</p>
            
            {!isConnected ? (
                <div className="flex-grow flex flex-col items-center justify-center bg-stone-900/50 rounded-lg">
                    <p className="text-2xl text-stone-400 mb-4">{statusMessage}</p>
                    <button onClick={handleConnect} className="px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xl">
                        Connect to Stream Deck
                    </button>
                </div>
            ) : (
                <div className="flex-grow grid grid-cols-3 gap-6">
                    <div className="col-span-1 bg-stone-900/50 p-4 rounded-lg overflow-y-auto">
                         <h3 className="text-lg font-bold mb-2">Available Actions</h3>
                         {Object.entries(actionCategories).map(([category, actions]) => (
                             <div key={category} className="mb-4">
                                 <h4 className="font-bold text-amber-300 border-b border-stone-600 mb-2 pb-1">{category}</h4>
                                 {actions.map(action => <DraggableAction key={action.label} action={action} onDragStart={handleDragStart} />)}
                             </div>
                         ))}
                    </div>
                    <div className="col-span-2 flex flex-col items-center justify-center">
                        <h3 className="text-lg font-bold mb-2">Virtual Stream Deck</h3>
                        <div className="stream-deck-grid w-full max-w-lg">
                            {streamDeckConfig.map((config, i) => (
                                <StreamDeckKey
                                    key={i}
                                    config={config}
                                    onDrop={(e) => handleDropOnKey(e, i)}
                                    onClick={() => config && onTriggerAction(config)}
                                    onClear={() => onSetKey(i, null)}
                                    resourceValues={resourceValues}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
