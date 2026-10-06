// components/map/MapWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import { LayerProvider } from './LayerContext';
import LayerSwitcher from './LayerSwitcher';

const MapView = dynamic(() => import('./MapView'), {
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
        <LayerProvider>
            <div style={{ position: 'relative', height: '100%', width: '100%' }}>
                <MapView />
                <LayerSwitcher />
            </div>
        </LayerProvider>
    );
}
