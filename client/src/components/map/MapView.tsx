// components/map/MapView.tsx
'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLayers } from './LayerContext';

const GERMANY_CENTER: [number, number] = [51.1657, 10.4515];
const GERMANY_ZOOM = 6;

function ResizeHandler() {
    const map = useMap();
    useEffect(() => {
        const resize = () => map.invalidateSize();
        window.addEventListener('resize', resize);
        const t = setTimeout(() => map.invalidateSize(), 100);
        return () => {
            window.removeEventListener('resize', resize);
            clearTimeout(t);
        };
    }, [map]);
    return null;
}

export default function MapView() {
    const { baseLayer, overlays } = useLayers();

    return (
        <MapContainer
            center={GERMANY_CENTER}
            zoom={GERMANY_ZOOM}
            minZoom={5}
            maxZoom={18}
            style={{ height: '100%', width: '100%' }}
        >
            {/* Basis-Layer – key erzwingt sauberes Neu-Rendern beim Wechsel */}
            <TileLayer
                key={baseLayer.id}
                url={baseLayer.url}
                attribution={baseLayer.attribution}
                maxZoom={baseLayer.maxZoom ?? 19}
            />

            {/* Overlays – können mehrere gleichzeitig aktiv sein */}
            {overlays.map((o) => (
                <TileLayer
                    key={o.id}
                    url={o.url}
                    attribution={o.attribution}
                    opacity={o.opacity ?? 1}
                    // Overlays über Basis-Layer legen
                    zIndex={10}
                />
            ))}

            <ResizeHandler />
        </MapContainer>
    );
}
