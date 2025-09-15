import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CharacterModelPlaceholder } from './CharacterModelPlaceholder';
import VirtualAssistant from './VirtualAssistant';
import AgentSearchPanel from './AgentSearchPanel';

const PLUGIN_BASE_WIDTH = 350; // Width of the model + chat
const AGENT_PANEL_WIDTH = 400; // Width of the expanded agent panel
const DOCK_OFFSET = 16; // Distance from screen edge
const DOCK_ZONE_WIDTH = 150; // How close to the edge to trigger docking
const PLUGIN_HEIGHT = 600; // Fixed height

const VirtualAssistantPlugin: React.FC = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [isAgentPanelVisible, setIsAgentPanelVisible] = useState(false);
    const [expansionDirection, setExpansionDirection] = useState<'left' | 'right'>('right');
    
    const dragRef = useRef<HTMLDivElement>(null);
    const dragStartOffset = useRef({ x: 0, y: 0 });
    const hasDragged = useRef(false);

    // Set initial position to bottom right on mount
    useEffect(() => {
        const initialX = window.innerWidth - PLUGIN_BASE_WIDTH - DOCK_OFFSET;
        const initialY = window.innerHeight - PLUGIN_HEIGHT - DOCK_OFFSET;
        setPosition({ x: initialX, y: Math.max(DOCK_OFFSET, initialY) });
    }, []);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button !== 0) return; // Only allow primary mouse button
        hasDragged.current = false;
        
        const rect = dragRef.current!.getBoundingClientRect();
        dragStartOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        
        setIsDragging(true);
    };
    
    // Effect to handle dragging logic with window event listeners
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!hasDragged.current) {
                hasDragged.current = true;
            }
            const newX = e.clientX - dragStartOffset.current.x;
            const newY = e.clientY - dragStartOffset.current.y;
            setPosition({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
             setPosition(currentPos => {
                const currentPluginWidth = dragRef.current?.offsetWidth ?? PLUGIN_BASE_WIDTH;
                let targetX = currentPos.x;

                // Docking logic: snap to sides if released near the edge
                if (currentPos.x < DOCK_ZONE_WIDTH) {
                    targetX = DOCK_OFFSET;
                } else if (currentPos.x + currentPluginWidth > window.innerWidth - DOCK_ZONE_WIDTH) {
                    targetX = window.innerWidth - currentPluginWidth - DOCK_OFFSET;
                }
                
                const clampedY = Math.max(
                    DOCK_OFFSET,
                    Math.min(currentPos.y, window.innerHeight - PLUGIN_HEIGHT - DOCK_OFFSET)
                );
                
                return { x: targetX, y: clampedY };
            });
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging]);
    
    const handleClick = () => {
        if (hasDragged.current) return; // Distinguish click from drag

        const nextVisibleState = !isAgentPanelVisible;

        if (nextVisibleState) {
            // EXPANDING: Decide direction and adjust position if needed
            const spaceOnRight = window.innerWidth - (position.x + PLUGIN_BASE_WIDTH);
            const spaceOnLeft = position.x;

            if (spaceOnRight < AGENT_PANEL_WIDTH + DOCK_OFFSET && spaceOnLeft > AGENT_PANEL_WIDTH + DOCK_OFFSET) {
                setExpansionDirection('left');
                setPosition(prev => ({ ...prev, x: prev.x - AGENT_PANEL_WIDTH }));
            } else {
                setExpansionDirection('right');
            }
        } else {
            // COLLAPSING: Adjust position back
            if (expansionDirection === 'left') {
                setPosition(prev => ({ ...prev, x: prev.x + AGENT_PANEL_WIDTH }));
            }
        }
        
        setIsAgentPanelVisible(nextVisibleState);
    };

    const currentWidth = PLUGIN_BASE_WIDTH + (isAgentPanelVisible ? AGENT_PANEL_WIDTH : 0);
    const flexOrderClass = expansionDirection === 'left' ? 'flex-row-reverse' : 'flex-row';

    return (
        <div
            ref={dragRef}
            className={`fixed flex rounded-2xl bg-slate-800/80 backdrop-blur-md transition-all duration-300 ease-out ${flexOrderClass}`}
            style={{
                top: `${position.y}px`,
                left: `${position.x}px`,
                width: `${currentWidth}px`,
                cursor: isDragging ? 'grabbing' : 'default',
                height: `${PLUGIN_HEIGHT}px`,
                boxShadow: '0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 1px 1px rgba(100, 200, 255, 0.3)',
                border: '1px solid rgba(100, 200, 255, 0.2)',
            }}
        >
            {/* Base Panel (Model + Chat) */}
            <div 
                className="flex-shrink-0 flex flex-col gap-4 p-4"
                style={{width: `${PLUGIN_BASE_WIDTH}px`}}
            >
                <div 
                    className="h-2/5" 
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    onMouseDown={handleMouseDown}
                    onClick={handleClick}
                >
                    <CharacterModelPlaceholder />
                </div>
                <div className="h-3/5 rounded-lg overflow-hidden border border-slate-700/50">
                    <VirtualAssistant />
                </div>
            </div>

            {/* Expandable Agent Panel */}
            <div 
                className="flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden"
                style={{
                  width: isAgentPanelVisible ? `${AGENT_PANEL_WIDTH}px` : '0px',
                  // Add a border that matches the flex direction
                  borderRight: expansionDirection === 'right' ? 'none' : '1px solid rgba(124, 137, 158, 0.3)',
                  borderLeft: expansionDirection === 'left' ? 'none' : '1px solid rgba(124, 137, 158, 0.3)',
                }}
            >
                <div style={{width: `${AGENT_PANEL_WIDTH}px`, height: '100%'}}>
                    <AgentSearchPanel />
                </div>
            </div>
        </div>
    );
};

export default VirtualAssistantPlugin;
