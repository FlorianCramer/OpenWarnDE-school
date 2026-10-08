import type { DataSource } from '../layers/schema';

interface RadarFrame {
    host?: string;
    radar?: { past?: { path?: string }[] };
}

let radarCache: { at: number; prefix: string } | null = null;

async function rainviewerPrefix(): Promise<string | null> {
    if (radarCache && Date.now() - radarCache.at < 60_000) return radarCache.prefix;
    const response = await fetch('https://api.rainviewer.com/public/weather-maps.json', {
        signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const body = (await response.json()) as RadarFrame;
    const frame = body.radar?.past?.at(-1);
    if (!body.host || !frame?.path) return null;
    radarCache = { at: Date.now(), prefix: `${body.host}${frame.path}` };
    return radarCache.prefix;
}

function fillTemplate(template: string, values: Record<string, string>) {
    return template.replace(/\{(z|x|y|apiKey)\}/g, (_, key: string) => values[key] ?? '');
}

export async function sourceTileUrl(
    source: DataSource,
    z: number,
    x: number,
    y: number,
): Promise<string | null> {
    const coords = { z: String(z), x: String(x), y: String(y), apiKey: source.apiKey };
    if (source.type === 'openweathermap') {
        if (!source.apiKey || !source.product) return null;
        const product = encodeURIComponent(source.product);
        return `https://tile.openweathermap.org/map/${product}/${z}/${x}/${y}.png?appid=${encodeURIComponent(source.apiKey)}`;
    }
    if (source.type === 'rainviewer') {
        const prefix = await rainviewerPrefix();
        if (!prefix) return null;
        const color = /^\d$/.test(source.product) ? source.product : '2';
        return `${prefix}/256/${z}/${x}/${y}/${color}/1_1.png`;
    }
    if (!['{z}', '{x}', '{y}'].every((placeholder) => source.urlTemplate.includes(placeholder))) {
        return null;
    }
    return fillTemplate(source.urlTemplate, coords);
}

export async function fetchSourcePng(source: DataSource, z: number, x: number, y: number) {
    const url = await sourceTileUrl(source, z, x, y);
    if (!url) return null;
    try {
        const response = await fetch(url, {
            signal: AbortSignal.timeout(8000),
            headers: { Accept: 'image/png,image/*' },
        });
        if (!response.ok) return null;
        const bytes = Buffer.from(await response.arrayBuffer());
        if (bytes.length < 8) return null;
        return bytes;
    } catch {
        return null;
    }
}
