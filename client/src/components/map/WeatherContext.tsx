'use client';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiUrl } from './weather-overlay';
import type { RadarMetadata, WeatherOverlay } from './weather-overlay';

const Context = createContext<{
    weather: WeatherOverlay | null;
    loading: boolean;
    error: string | null;
} | null>(null);

export function WeatherProvider({ children }: { children: ReactNode }) {
    const [weather, setWeather] = useState<WeatherOverlay | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        let cancelled = false;
        const weatherRequest = fetch(apiUrl('/api/v1/weather')).then(async (r) => {
            const body = await r.json();
            if (!r.ok) throw new Error('Wetterlayer konnte nicht geladen werden');
            return body as { weather: WeatherOverlay | null };
        });
        const radarRequest = fetch(apiUrl('/api/v1/weather/radar/metadata'))
            .then(async (r) => {
                if (!r.ok) return null;
                return (await r.json()) as RadarMetadata;
            })
            .catch(() => null);
        Promise.all([weatherRequest, radarRequest])
            .then(([body, radar]) => {
                if (!cancelled) setWeather(body.weather ? { ...body.weather, radar } : null);
            })
            .catch(() => {
                if (!cancelled) setError('Wetterserver nicht erreichbar');
            })
            .finally(() => setLoading(false));
        return () => {
            cancelled = true;
        };
    }, []);
    const value = useMemo(() => ({ weather, loading, error }), [weather, loading, error]);
    return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useWeather() {
    const value = useContext(Context);
    if (!value) throw new Error('useWeather must be used within <WeatherProvider>');
    return value;
}
