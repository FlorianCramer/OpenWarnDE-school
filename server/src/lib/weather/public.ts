import type { WeatherConfig, WeatherSource } from './schema';
import { WEATHER_LEGEND_8 } from './palette';
import { activeWeather } from './compose';
export { activeWeather } from './compose';
export const WEATHER_LEGEND = [
    { color: '#9bdcf7', label: '< 1 mm/h · sehr leicht' },
    { color: '#2f80ed', label: '1-3 mm/h · leicht/mäßig' },
    { color: '#123b9b', label: '> 3 mm/h · mäßig/stark' },
    { color: '#ffd21f', label: '> 10 mm/h · sehr stark' },
    { color: '#f04424', label: '> 30 mm/h · extrem' },
];
function credit(source: WeatherSource) {
    if (source.type === 'xyz') return source.name;
    if (source.type === 'rainviewer') return 'RainViewer';
    if (source.type === 'dwd-radolan') return 'DWD RADOLAN';
    if (source.type === 'radrview') return 'RadrView';
    return 'OpenWeatherMap';
}
export function publicWeather(config: WeatherConfig, origin: string) {
    const inputs = activeWeather(config);
    if (inputs.length === 0) return null;
    return {
        tileUrl: `${origin}/api/v1/weather/radar/tiles/{z}/{x}/{y}.png`,
        opacity: config.weather.opacity,
        attribution: [...new Set(inputs.map((x) => credit(x.source)))].join(', '),
        legend: WEATHER_LEGEND_8,
        mode: 'raster',
        detailLevels: [
            { id: 'overview', minZoom: 0, maxZoom: 5 },
            { id: 'regional', minZoom: 6, maxZoom: 8 },
            { id: 'local', minZoom: 9, maxZoom: 11 },
            { id: 'high', minZoom: 12, maxZoom: 18 },
        ],
    };
}
