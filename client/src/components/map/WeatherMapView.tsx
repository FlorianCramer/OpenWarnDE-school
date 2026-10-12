'use client';

import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useWeather } from './WeatherContext';
import type { RadarMetadata } from './weather-overlay';

const CENTER: [number, number] = [10.4515, 51.1657];
const BASE_SOURCE = 'openstreetmap-base-source';
const BASE_LAYER = 'openstreetmap-base-layer';
const RADAR_SOURCE = 'weather-radar-source';
const RADAR_LAYER = 'weather-radar-layer';
const MAPLIBRE_WORKER_URL = '/maplibre-gl-worker.mjs?v=6.12.0';

function radarOpacity(opacity: number) {
    return Math.min(0.7, Math.max(0.45, opacity));
}

function addRadarLayer(map: MapLibreMap, radar: RadarMetadata | null) {
    if (!radar || map.getSource(RADAR_SOURCE)) return;
    map.addSource(RADAR_SOURCE, {
        type: 'raster',
        tiles: [radar.tileUrl],
        tileSize: radar.tileSize,
        minzoom: radar.minZoom,
        maxzoom: radar.maxZoom,
    });
    map.addLayer({
        id: RADAR_LAYER,
        type: 'raster',
        source: RADAR_SOURCE,
        paint: { 'raster-opacity': 0 },
    });
}

function updateRadarOpacity(map: MapLibreMap, opacity: number) {
    if (map.getLayer(RADAR_LAYER)) {
        map.setPaintProperty(RADAR_LAYER, 'raster-opacity', radarOpacity(opacity));
    }
}

export default function WeatherMapView() {
    const { weather } = useWeather();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<MapLibreMap | null>(null);
    const radar = weather?.radar ?? null;
    const radarRef = useRef<RadarMetadata | null>(radar);
    const radarOpacityRef = useRef(0);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;
        maplibregl.setWorkerUrl(MAPLIBRE_WORKER_URL);
        const map = new maplibregl.Map({
            container: containerRef.current,
            center: CENTER,
            zoom: 6,
            style: {
                version: 8,
                sources: {
                    [BASE_SOURCE]: {
                        type: 'raster',
                        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        maxzoom: 19,
                    },
                },
                layers: [
                    {
                        id: BASE_LAYER,
                        type: 'raster',
                        source: BASE_SOURCE,
                    },
                ],
            },
        });
        map.addControl(new maplibregl.NavigationControl(), 'top-right');
        mapRef.current = map;
        map.on('load', () => {
            addRadarLayer(map, radarRef.current);
            updateRadarOpacity(map, radarOpacityRef.current);
        });
        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    useEffect(() => {
        radarRef.current = radar;
        radarOpacityRef.current = weather?.opacity ?? 0;
        const map = mapRef.current;
        if (!map || !map.isStyleLoaded() || !radar) return;
        addRadarLayer(map, radar);
        updateRadarOpacity(map, weather?.opacity ?? 0);
    }, [radar, weather?.opacity]);

    return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />;
}
