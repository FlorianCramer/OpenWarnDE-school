// components/map/MapWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import { WeatherProvider } from './WeatherContext';
import { LocationProvider } from './LocationContext';
import WeatherLegend from './WeatherLegend';
import LocationButton from './LocationButton';

const MapView = dynamic(() => import('./WeatherMapView'), {
    ssr: false,
    loading: () => <MapLoadingScreen />,
});

export default function MapWrapper() {
    return (
        <LocationProvider>
            <WeatherProvider>
                <div className="relative h-full w-full">
                    <MapView />
                    <WeatherLegend />
                    <LocationButton />
                </div>
            </WeatherProvider>
        </LocationProvider>
    );
}

function MapLoadingScreen() {
    return (
        <div
            role="status"
            aria-live="polite"
            className="flex h-dvh w-screen flex-col items-center justify-center gap-6 bg-background text-foreground"
        >
            <span
                aria-hidden="true"
                className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary motion-reduce:animate-none"
            />

            <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                    Karte wird geladen…
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                    Wetterdaten werden abgerufen
                </p>
            </div>
        </div>
    );
}