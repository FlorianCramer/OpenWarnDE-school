import type { AppConfig } from './schema';

export const defaultConfig = (): AppConfig => ({
    sources: [
        {
            id: 'rainviewer-radar',
            name: 'RainViewer Radar',
            type: 'rainviewer',
            product: '2',
            apiKey: '',
            urlTemplate: '',
            enabled: true,
        },
        {
            id: 'owm-precip',
            name: 'OpenWeatherMap Niederschlag',
            type: 'openweathermap',
            product: 'precipitation_new',
            apiKey: '',
            urlTemplate: '',
            enabled: false,
        },
    ],
    layers: [
        {
            id: 'osm',
            name: 'Standard (OSM)',
            enabled: true,
            basemap: {
                urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
            },
            weather: { opacity: 0.7, inputs: [] },
        },
        {
            id: 'topo',
            name: 'Topografie',
            enabled: true,
            basemap: {
                urlTemplate: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                attribution:
                    'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
                maxZoom: 17,
            },
            weather: { opacity: 0.7, inputs: [] },
        },
        {
            id: 'satellite',
            name: 'Satellit',
            enabled: true,
            basemap: {
                urlTemplate:
                    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
                maxZoom: 19,
            },
            weather: { opacity: 0.7, inputs: [] },
        },
        {
            id: 'niederschlag',
            name: 'Niederschlag',
            enabled: true,
            basemap: {
                urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
            },
            weather: {
                opacity: 0.75,
                inputs: [
                    { sourceId: 'rainviewer-radar', weight: 70 },
                    { sourceId: 'owm-precip', weight: 30 },
                ],
            },
        },
    ],
});
