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
    const { active } = useLayers();

    return (
        <MapContainer
            center={GERMANY_CENTER}
            zoom={GERMANY_ZOOM}
            minZoom={5}
            maxZoom={18}
            style={{ height: '100%', width: '100%' }}
        >
            {active ? (
                <TileLayer
                    key={`${active.id}-base`}
                    url={active.basemap.url}
                    attribution={active.basemap.attribution}
                    maxZoom={active.basemap.maxZoom}
                />
            ) : null}
            {active?.weather ? (
                <TileLayer
                    key={`${active.id}-weather`}
                    url={active.weather.url}
                    attribution={active.weather.attribution}
                    opacity={active.weather.opacity}
                    zIndex={10}
                />
            ) : null}
            <ResizeHandler />
        </MapContainer>
    );
}
