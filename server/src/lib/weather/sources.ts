import type { WeatherSource } from './schema';
interface RadarFrame {
    host?: string;
    radar?: { past?: { path?: string; time?: number }[] };
}
export interface RadarSourceMetadata {
    timestamp: string;
    updatedAt: string;
}
let radarCache: {
    at: number;
    prefix: string;
    timestamp: string;
    updatedAt: string;
} | null = null;
let radrviewCache: { at: number; timestamp: string; updatedAt: string } | null = null;

function radarTimestamp(frame: { path?: string; time?: number }) {
    if (typeof frame.time === 'number' && Number.isFinite(frame.time)) {
        return new Date(frame.time * 1000).toISOString();
    }
    const match = frame.path?.match(/(?:^|\/)(\d{10})(?:\/|$)/);
    return match ? new Date(Number(match[1]) * 1000).toISOString() : null;
}

async function rainviewerFrame() {
    if (radarCache && Date.now() - radarCache.at < 60_000) return radarCache;
    try {
        const response = await fetch('https://api.rainviewer.com/public/weather-maps.json', {
            signal: AbortSignal.timeout(8000),
        });
        if (response.ok) {
            const body = (await response.json()) as RadarFrame;
            const frame = body.radar?.past?.at(-1);
            const timestamp = frame && radarTimestamp(frame);
            if (body.host && frame?.path && timestamp) {
                radarCache = {
                    at: Date.now(),
                    prefix: `${body.host}${frame.path}`,
                    timestamp,
                    updatedAt: new Date().toISOString(),
                };
            }
        }
    } catch {
        // Keep the last successful product available during a source outage.
    }
    return radarCache;
}

async function rainviewerPrefix() {
    return (await rainviewerFrame())?.prefix ?? null;
}

export async function getRainViewerMetadata(): Promise<RadarSourceMetadata | null> {
    const frame = await rainviewerFrame();
    return frame ? { timestamp: frame.timestamp, updatedAt: frame.updatedAt } : null;
}

export function getRadarCacheVersion() {
    return `${radarCache?.timestamp ?? 'unknown'}:${radrviewCache?.timestamp ?? 'unknown'}`;
}
async function radrviewTimestamp(baseUrl: string, product: string) {
    if (radrviewCache && Date.now() - radrviewCache.at < 60_000) return radrviewCache.timestamp;
    try {
        const response = await fetch(
            `${baseUrl.replace(/\/$/, '')}/frames/latest?source=${encodeURIComponent(product || 'composite')}`,
            { signal: AbortSignal.timeout(8000) },
        );
        if (!response.ok) return null;
        const body = (await response.json()) as { timestamp?: string };
        if (!body.timestamp) return null;
        radrviewCache = {
            at: Date.now(),
            timestamp: body.timestamp,
            updatedAt: new Date().toISOString(),
        };
        return body.timestamp;
    } catch {
        return null;
    }
}

export async function getRadrViewMetadata(
    baseUrl: string,
    product: string,
): Promise<RadarSourceMetadata | null> {
    const timestamp = await radrviewTimestamp(baseUrl, product);
    return radrviewCache && timestamp ? { timestamp, updatedAt: radrviewCache.updatedAt } : null;
}
function mercatorBounds(z: number, x: number, y: number) {
    const size = 40075016.68557849;
    const tile = size / 2 ** z;
    const minX = -size / 2 + x * tile;
    const maxX = minX + tile;
    const maxY = size / 2 - y * tile;
    const minY = maxY - tile;
    return `${minX},${minY},${maxX},${maxY}`;
}
function fill(template: string, values: Record<string, string>) {
    return template.replace(/\{(z|x|y|apiKey)\}/g, (_, key: string) => values[key] ?? '');
}
export async function sourceTileUrl(source: WeatherSource, z: number, x: number, y: number) {
    if (source.type === 'openweathermap') {
        if (!source.apiKey || !source.product) return null;
        return `https://tile.openweathermap.org/map/${encodeURIComponent(source.product)}/${z}/${x}/${y}.png?appid=${encodeURIComponent(source.apiKey)}`;
    }
    if (source.type === 'rainviewer') {
        const prefix = await rainviewerPrefix();
        return prefix
            ? `${prefix}/256/${z}/${x}/${y}/${/^\d$/.test(source.product) ? source.product : '2'}/1_1.png`
            : null;
    }
    if (source.type === 'dwd-radolan') {
        const layer = /^[A-Za-z0-9:_-]+$/.test(source.product) ? source.product : 'dwd:RADOLAN-RY';
        const params = new URLSearchParams({
            service: 'WMS',
            version: '1.1.1',
            request: 'GetMap',
            layers: layer,
            styles: '',
            format: 'image/png',
            transparent: 'true',
            width: '256',
            height: '256',
            srs: 'EPSG:3857',
            bbox: mercatorBounds(z, x, y),
        });
        return `https://maps.dwd.de/geoserver/dwd/wms?${params.toString()}`;
    }
    if (source.type === 'radrview') {
        const base = source.urlTemplate || 'https://radrview.com';
        const timestamp = await radrviewTimestamp(base, source.product || 'composite');
        return timestamp
            ? `${base.replace(/\/$/, '')}/tile/${timestamp}/${z}/${x}/${y}?palette=default&source=${encodeURIComponent(source.product || 'composite')}`
            : null;
    }
    if (!['{z}', '{x}', '{y}'].every((p) => source.urlTemplate.includes(p))) return null;
    return fill(source.urlTemplate, {
        z: String(z),
        x: String(x),
        y: String(y),
        apiKey: source.apiKey,
    });
}
export async function fetchSourcePng(source: WeatherSource, z: number, x: number, y: number) {
    const url = await sourceTileUrl(source, z, x, y);
    if (!url) return null;
    try {
        const response = await fetch(url, {
            signal: AbortSignal.timeout(8000),
            headers: { Accept: 'image/png,image/*' },
        });
        if (!response.ok) return null;
        const bytes = Buffer.from(await response.arrayBuffer());
        return bytes.length >= 8 ? bytes : null;
    } catch {
        return null;
    }
}
