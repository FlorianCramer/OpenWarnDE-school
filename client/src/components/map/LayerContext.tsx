'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiUrl } from './server-layers';
import type { ServerLayer } from './server-layers';

interface LayerContextValue {
    layers: ServerLayer[];
    active: ServerLayer | null;
    setActive: (id: string) => void;
    loading: boolean;
    error: string | null;
}

const LayerContext = createContext<LayerContextValue | null>(null);

export function LayerProvider({ children }: { children: ReactNode }) {
    const [layers, setLayers] = useState<ServerLayer[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetch(apiUrl('/api/v1/layers'))
            .then(async (response) => {
                const body = await response.json();
                if (!response.ok) throw new Error('Layer konnten nicht geladen werden');
                return body as { layers: ServerLayer[] };
            })
            .then((body) => {
                if (cancelled) return;
                setLayers(body.layers);
                setActiveId((current) => current ?? body.layers[0]?.id ?? null);
            })
            .catch(() => {
                if (!cancelled)
                    setError('Server nicht erreichbar. Layer können nicht geladen werden.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const value = useMemo<LayerContextValue>(
        () => ({
            layers,
            active: layers.find((layer) => layer.id === activeId) ?? null,
            setActive: setActiveId,
            loading,
            error,
        }),
        [layers, activeId, loading, error],
    );

    return <LayerContext.Provider value={value}>{children}</LayerContext.Provider>;
}

export function useLayers() {
    const ctx = useContext(LayerContext);
    if (!ctx) throw new Error('useLayers must be used within <LayerProvider>');
    return ctx;
}
