import type { WeatherConfig } from './schema';
export const defaultWeatherConfig = (): WeatherConfig => ({
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
        {
            id: 'dwd-radolan',
            name: 'DWD RADOLAN',
            type: 'dwd-radolan',
            product: 'dwd:RADOLAN-RY',
            apiKey: '',
            urlTemplate: '',
            enabled: true,
        },
        {
            id: 'radrview',
            name: 'RadrView',
            type: 'radrview',
            product: 'composite',
            apiKey: '',
            urlTemplate: 'https://radrview.com',
            enabled: true,
        },
    ],
    weather: {
        enabled: true,
        opacity: 0.8,
        inputs: [
            { sourceId: 'rainviewer-radar', weight: 45 },
            { sourceId: 'dwd-radolan', weight: 35 },
            { sourceId: 'radrview', weight: 20 },
        ],
    },
});
