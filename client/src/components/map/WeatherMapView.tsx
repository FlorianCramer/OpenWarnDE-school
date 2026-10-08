'use client';
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
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
type WeatherFeatureCollection = {
    type: 'FeatureCollection';
    features: GeoJSON.Feature<GeoJSON.Polygon, { color: string }>[];
};
function WeatherGeoJsonLayer({ url, opacity }: { url: string; opacity: number }) {
    const map = useMap();
    const layer = useRef<L.GeoJSON | null>(null);
    useEffect(() => {
        let disposed = false;
        const controller = new AbortController();
        const load = async () => {
            const bounds = map.getBounds();
            const bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()].join(',');
            const response = await fetch(`${url}?bbox=${encodeURIComponent(bbox)}&zoom=${map.getZoom()}`, { signal: controller.signal });
            if (!response.ok) throw new Error('Wetterflächen konnten nicht geladen werden');
            const data = (await response.json()) as WeatherFeatureCollection;
            if (disposed) return;
            layer.current?.removeFrom(map);
            layer.current = L.geoJSON(data as GeoJSON.GeoJsonObject, {
                style: (feature) => ({
                    color: feature?.properties?.color ?? '#9bdcf7',
                    fillColor: feature?.properties?.color ?? '#9bdcf7',
                    fillOpacity: opacity,
                    opacity: 1,
                    weight: 0,
                    smoothFactor: 1.5,
                }),
                interactive: false,
                pane: 'overlayPane',
            }).addTo(map);
        };
        const reload = () => void load().catch((error: unknown) => {
            if (error instanceof DOMException && error.name === 'AbortError') return;
            console.error(error);
        });
        map.on('moveend zoomend', reload);
        reload();
        return () => {
            disposed = true;
            controller.abort();
            map.off('moveend zoomend', reload);
            layer.current?.removeFrom(map);
            layer.current = null;
        };
    }, [map, opacity, url]);
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
            preferCanvas
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
                maxZoom={19}
            />
            {weather ? (
                <WeatherGeoJsonLayer
                    key={weather.url}
                    url={weather.url}
                    opacity={weather.opacity}
                />
            ) : null}
            <ResizeHandler />
        </MapContainer>
    );
}
