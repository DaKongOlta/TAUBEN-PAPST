// FIX: Import `React` to make its namespace available for type annotations like React.MouseEvent.
import React, { useState, useCallback, useRef } from 'react';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

export const usePanZoom = () => {
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const isPanning = useRef(false);
    const lastPanPoint = useRef({ x: 0, y: 0 });

    const pan = useCallback((e: React.MouseEvent) => {
        if (!isPanning.current) return;
        const dx = e.clientX - lastPanPoint.current.x;
        const dy = e.clientY - lastPanPoint.current.y;
        setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
        lastPanPoint.current = { x: e.clientX, y: e.clientY };
    }, []);

    const startPan = useCallback((e: React.MouseEvent) => {
        isPanning.current = true;
        lastPanPoint.current = { x: e.clientX, y: e.clientY };
    }, []);

    const endPan = useCallback(() => {
        isPanning.current = false;
    }, []);
    
    const zoom = useCallback((e: React.WheelEvent, container: HTMLDivElement | null) => {
        if (!container) return;
        e.preventDefault();
        const delta = e.deltaY * -0.005;
        const newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, transform.scale + delta));
        
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const newX = transform.x - (mouseX - transform.x) * (newScale / transform.scale - 1);
        const newY = transform.y - (mouseY - transform.y) * (newScale / transform.scale - 1);

        setTransform({ x: newX, y: newY, scale: newScale });
    }, [transform]);

    const resetZoom = useCallback(() => {
        setTransform({ x: 0, y: 0, scale: 1 });
    }, []);
    
    const manualZoom = useCallback((direction: 'in' | 'out') => {
        const zoomStep = 0.2;
        const delta = direction === 'in' ? zoomStep : -zoomStep;
        setTransform(t => {
            const newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, t.scale + delta));
            return { ...t, scale: newScale };
        });
    }, []);

    return { transform, startPan, endPan, pan, zoom, resetZoom, manualZoom };
};