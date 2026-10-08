import type { WeatherConfig, WeatherSource } from './schema';
import { WEATHER_LEGEND_8 } from './palette';
export const WEATHER_LEGEND = [
    { color: '#9bdcf7', label: '< 1 mm/h · sehr leicht' },
    { color: '#2f80ed', label: '1-3 mm/h · leicht/mäßig' },
    { color: '#123b9b', label: '> 3 mm/h · mäßig/stark' },
    { color: '#ffd21f', label: '> 10 mm/h · sehr stark' },
    { color: '#f04424', label: '> 30 mm/h · extrem' },
];
function active(config: WeatherConfig) {
    return config.weather.inputs.flatMap((input) => {
        const source = config.sources.find((item) => item.id === input.sourceId);
        return source && source.enabled && input.weight > 0
            ? [{ source, weight: input.weight }]
            : [];
    });
}
function credit(source: WeatherSource) {
    if (source.type === 'xyz') return source.name;
    if (source.type === 'rainviewer') return 'RainViewer';
    if (source.type === 'dwd-radolan') return 'DWD RADOLAN';
    if (source.type === 'radrview') return 'RadrView';
    return 'OpenWeatherMap';
}
export function publicWeather(config: WeatherConfig, origin: string) {
    const inputs = active(config);
    if (!config.weather.enabled || inputs.length === 0) return null;
    return {
        url: `${origin}/api/v1/weather/geojson`,
        opacity: config.weather.opacity,
        attribution: [...new Set(inputs.map((x) => credit(x.source)))].join(', '),
        legend: WEATHER_LEGEND_8,
    };
}
export function activeWeather(config: WeatherConfig) {
    return config.weather.enabled ? active(config) : [];
}
