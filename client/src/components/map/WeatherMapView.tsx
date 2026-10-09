'use client';
import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useWeather } from './WeatherContext';
import { apiOrigin } from './weather-overlay';

const CENTER: [number, number] = [51.1657, 10.4515];

function ResizeHandler() {
    const map = useMap();
    useEffect(() => {
        const resize = () => map.invalidateSize();
        window.addEventListener('resize', resize);
        const timer = setTimeout(resize, 100);
        return () => {
            window.removeEventListener('resize', resize);
            clearTimeout(timer);
        };
    }, [map]);
    return null;
}

function WeatherTileLayer({ url, opacity }: { url: string; opacity: number }) {
    return (
        <TileLayer
            url={url}
            opacity={Math.min(0.7, Math.max(0.45, opacity))}
            zIndex={450}
            attribution="&copy; OpenStreetMap contributors"
            tileSize={256}
            minZoom={5}
            maxZoom={18}
            maxNativeZoom={18}
            noWrap
            crossOrigin="anonymous"
            detectRetina={false}
        />
    );
}

export default function WeatherMapView() {
    const { weather } = useWeather();
    const tileUrl = weather?.tileUrl ?? `${apiOrigin()}/api/v1/weather?z={z}&x={x}&y={y}`;

    return (
        <MapContainer
            center={CENTER}
            zoom={6}
            minZoom={5}
            maxZoom={18}
            preferCanvas
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
                maxZoom={19}
            />
            {weather ? (
                <WeatherTileLayer key={weather.url} url={tileUrl} opacity={weather.opacity} />
            ) : null}
            <ResizeHandler />
        </MapContainer>
    );
}
