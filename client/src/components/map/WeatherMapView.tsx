'use client';
import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useWeather } from './WeatherContext';
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
export default function WeatherMapView() {
    const { weather } = useWeather();
    return (
        <MapContainer
            center={CENTER}
            zoom={6}
            minZoom={5}
            maxZoom={18}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
                maxZoom={19}
            />
            {weather ? (
                <TileLayer
                    key={weather.url}
                    url={weather.url}
                    attribution={weather.attribution}
                    opacity={weather.opacity}
                    zIndex={10}
                />
            ) : null}
            <ResizeHandler />
        </MapContainer>
    );
}
