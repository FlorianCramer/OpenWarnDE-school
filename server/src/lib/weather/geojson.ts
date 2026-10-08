import { PNG } from 'pngjs';
import { activeWeather } from './public';
import { WEATHER_LEGEND_8 } from './palette';
import { getWeatherConfig } from './store';
import { composeWeatherTile } from './compose';

type Feature = { type: 'Feature'; properties: { class: number; color: string; rate: string }; geometry: { type: 'Polygon'; coordinates: number[][][] } };
export type WeatherGeoJson = { type: 'FeatureCollection'; features: Feature[]; properties: { dataZoom: number; legend: typeof WEATHER_LEGEND_8 } };
const COLORS = WEATHER_LEGEND_8.map((item) => item.color);
// Gröbere Zellen reduzieren die GeoJSON-Größe deutlich und bleiben beim hohen
// Client-Zoom scharf, weil Leaflet die Polygone als Vektoren rendert.
function cellScale(zoom: number) {
    if (zoom <= 5) return 8;
    if (zoom === 6) return 4;
    return 1;
}
function lon(x: number, zoom: number) { return (x / 2 ** zoom) * 360 - 180; }
function lat(y: number, zoom: number) { const n = Math.PI - (2 * Math.PI * y) / 2 ** zoom; return (180 / Math.PI) * Math.atan(Math.sinh(n)); }
function classify(r: number, g: number, b: number, a: number) {
    if (!a) return 0;
    let best = 0, distance = Number.POSITIVE_INFINITY;
    for (let index = 0; index < COLORS.length; index += 1) {
        const hex = COLORS[index].slice(1), color = [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4), 16)];
        const next = (r - color[0]) ** 2 + (g - color[1]) ** 2 + (b - color[2]) ** 2;
        if (next < distance) { distance = next; best = index; }
    }
    return best;
}
function roundRing(ring: number[][], radius: number) {
    const corners = ring.slice(0, -1);
    const rounded: number[][] = [];
    for (let index = 0; index < corners.length; index += 1) {
        const previous = corners[(index + corners.length - 1) % corners.length];
        const current = corners[index];
        const next = corners[(index + 1) % corners.length];
        const previousLength = Math.hypot(previous[0] - current[0], previous[1] - current[1]);
        const nextLength = Math.hypot(next[0] - current[0], next[1] - current[1]);
        const amount = Math.min(radius, previousLength / 3, nextLength / 3);
        const start = [current[0] + ((previous[0] - current[0]) / previousLength) * amount, current[1] + ((previous[1] - current[1]) / previousLength) * amount];
        const end = [current[0] + ((next[0] - current[0]) / nextLength) * amount, current[1] + ((next[1] - current[1]) / nextLength) * amount];
        rounded.push(start, [start[0] * 0.5 + current[0] * 0.5, start[1] * 0.5 + current[1] * 0.5], [end[0] * 0.5 + current[0] * 0.5, end[1] * 0.5 + current[1] * 0.5], end);
    }
    return [...rounded, rounded[0]];
}
function tileFeatures(png: Buffer, tileX: number, tileY: number, zoom: number): Feature[] {
    const image = PNG.sync.read(png), features: Feature[] = [], active = new Map<string, Feature>();
    const scale = cellScale(zoom);
    const finish = (key: string) => {
        const feature = active.get(key);
        if (!feature) return;
        const ring = feature.geometry.coordinates[0];
        const width = Math.abs(ring[1][0] - ring[0][0]);
        const height = Math.abs(ring[2][1] - ring[1][1]);
        feature.geometry.coordinates[0] = roundRing(ring, Math.min(width, height) * 0.12);
        features.push(feature);
        active.delete(key);
    };
    for (let py = 0; py < image.height; py += scale) {
        const used = new Set<string>();
        for (let px = 0; px < image.width; px += scale) {
            const offset = (py * image.width + px) << 2;
            if (!image.data[offset + 3]) continue;
            const index = classify(image.data[offset], image.data[offset + 1], image.data[offset + 2], image.data[offset + 3]);
            const x0 = tileX + px / image.width, x1 = tileX + Math.min(image.width, px + scale) / image.width;
            const y0 = tileY + py / image.height, y1 = tileY + Math.min(image.height, py + scale) / image.height;
            const key = `${index}:${x0}:${x1}`; used.add(key);
            const old = active.get(key);
            if (old) { old.geometry.coordinates[0][2][1] = lat(y1, zoom); old.geometry.coordinates[0][3][1] = lat(y1, zoom); }
            else active.set(key, { type: 'Feature', properties: { class: index, color: COLORS[index], rate: WEATHER_LEGEND_8[index]?.label ?? '' }, geometry: { type: 'Polygon', coordinates: [[[lon(x0, zoom), lat(y1, zoom)], [lon(x1, zoom), lat(y1, zoom)], [lon(x1, zoom), lat(y0, zoom)], [lon(x0, zoom), lat(y0, zoom)], [lon(x0, zoom), lat(y1, zoom)]]] } });
        }
        for (const key of active.keys()) if (!used.has(key)) finish(key);
    }
    for (const key of active.keys()) finish(key);
    return features;
}
function tileX(value: number, zoom: number) { return Math.floor((value / 360 + 0.5) * 2 ** zoom); }
function tileY(value: number, zoom: number) { const latitude = Math.max(-85, Math.min(85, value)); return Math.floor((1 - Math.log(Math.tan(latitude * Math.PI / 180) + 1 / Math.cos(latitude * Math.PI / 180)) / Math.PI) / 2 * 2 ** zoom); }
export async function weatherGeoJson(minLon: number, minLat: number, maxLon: number, maxLat: number, requestedZoom: number): Promise<WeatherGeoJson> {
    // Die aktuell konfigurierten externen Quellen liefern zuverlässig bis z7.
    // Darüber bleibt die letzte verfügbare Vektorauflösung sichtbar statt leer zu werden.
    const dataZoom = Math.max(5, Math.min(7, Math.round(requestedZoom)));
    if (!activeWeather(getWeatherConfig()).length) return { type: 'FeatureCollection', features: [], properties: { dataZoom, legend: WEATHER_LEGEND_8 } };
    const minX = Math.max(0, tileX(minLon, dataZoom)), maxX = Math.min(2 ** dataZoom - 1, tileX(maxLon, dataZoom));
    const minY = Math.max(0, tileY(maxLat, dataZoom)), maxY = Math.min(2 ** dataZoom - 1, tileY(minLat, dataZoom));
    const features = (await Promise.all(Array.from({ length: maxX - minX + 1 }, (_, ix) => Array.from({ length: maxY - minY + 1 }, async (_, iy) => tileFeatures(await composeWeatherTile(dataZoom, minX + ix, minY + iy), minX + ix, minY + iy, dataZoom))).flat())).flat();
    return { type: 'FeatureCollection', features, properties: { dataZoom, legend: WEATHER_LEGEND_8 } };
}
