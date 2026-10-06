// components/map/LayerContext.tsx
'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { BASE_LAYERS, type BaseLayer, type BaseLayerId } from './layers';
import { OVERLAYS, type Overlay, type OverlayId } from './overlays';

interface LayerContextValue {
    baseLayer: BaseLayer;
    setBaseLayer: (id: BaseLayerId) => void;
    overlays: Overlay[];
    toggleOverlay: (id: OverlayId) => void;
    isOverlayActive: (id: OverlayId) => boolean;
}

const LayerContext = createContext<LayerContextValue | null>(null);

export function LayerProvider({ children }: { children: ReactNode }) {
    const [baseId, setBaseId] = useState<BaseLayerId>('osm');
    const [activeOverlayIds, setActiveOverlayIds] = useState<OverlayId[]>([]);

    const value = useMemo<LayerContextValue>(() => {
        const toggleOverlay = (id: OverlayId) =>
            setActiveOverlayIds((prev) =>
                prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
            );

        return {
            baseLayer: BASE_LAYERS[baseId],
            setBaseLayer: setBaseId,
            overlays: activeOverlayIds.map((id) => OVERLAYS[id]),
            toggleOverlay,
            isOverlayActive: (id) => activeOverlayIds.includes(id),
        };
    }, [baseId, activeOverlayIds]);

    return <LayerContext.Provider value={value}>{children}</LayerContext.Provider>;
}

export function useLayers() {
    const ctx = useContext(LayerContext);
    if (!ctx) throw new Error('useLayers must be used within <LayerProvider>');
    return ctx;
}
