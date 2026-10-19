'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { getCurrentUserLocation, type UserCoordinates } from '@/lib/geolocation';

export type LocationStatus = 'idle' | 'loading' | 'success' | 'error';

interface LocationContextValue {
    location: UserCoordinates | null;
    status: LocationStatus;
    error: string | null;
    centerTrigger: number;
    requestLocation: () => Promise<void>;
    recenterLocation: () => void;
    clearError: () => void;
    setDemoLocation: (latitude?: number, longitude?: number) => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
    const [location, setLocation] = useState<UserCoordinates | null>(null);
    const [status, setStatus] = useState<LocationStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [centerTrigger, setCenterTrigger] = useState(0);

    const requestLocation = useCallback(async () => {
        setStatus('loading');
        setError(null);
        try {
            const coords = await getCurrentUserLocation();
            setLocation(coords);
            setStatus('success');
            setCenterTrigger((prev) => prev + 1);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Der Standort konnte nicht ermittelt werden.';
            setError(message);
            setStatus('error');
        }
    }, []);

    const recenterLocation = useCallback(() => {
        if (location) {
            setCenterTrigger((prev) => prev + 1);
        } else {
            void requestLocation();
        }
    }, [location, requestLocation]);

    const clearError = useCallback(() => {
        setError(null);
        if (status === 'error') {
            setStatus(location ? 'success' : 'idle');
        }
    }, [status, location]);

    const setDemoLocation = useCallback((latitude = 52.52, longitude = 13.405) => {
        setLocation({
            latitude,
            longitude,
            accuracy: 35,
            timestamp: Date.now(),
            altitude: null,
            heading: null,
            speed: null,
        });
        setStatus('success');
        setError(null);
        setCenterTrigger((prev) => prev + 1);
    }, []);

    const value = useMemo(
        () => ({
            location,
            status,
            error,
            centerTrigger,
            requestLocation,
            recenterLocation,
            clearError,
            setDemoLocation,
        }),
        [
            location,
            status,
            error,
            centerTrigger,
            requestLocation,
            recenterLocation,
            clearError,
            setDemoLocation,
        ],
    );

    return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
    const ctx = useContext(LocationContext);
    if (!ctx) {
        throw new Error('useLocation must be used within <LocationProvider>');
    }
    return ctx;
}
