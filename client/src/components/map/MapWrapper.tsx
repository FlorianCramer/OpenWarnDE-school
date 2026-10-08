// components/map/MapWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import { WeatherProvider } from './WeatherContext';
import WeatherLegend from './WeatherLegend';

const MapView = dynamic(() => import('./WeatherMapView'), {
    ssr: false,
    loading: () => (
        <div
            style={{
                height: '100dvh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#111',
                color: '#fff',
            }}
        >
            Karte lädt…
        </div>
    ),
});

export default function MapWrapper() {
    return (
        <WeatherProvider>
            <div style={{ position: 'relative', height: '100%', width: '100%' }}>
                <MapView />
                <WeatherLegend />
            </div>
        </WeatherProvider>
    );
}
