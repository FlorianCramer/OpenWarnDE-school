import { PNG } from 'pngjs';
import { getWeatherConfig, getWeatherConfigVersion } from './store';
import { fetchSourcePng, getRadarCacheVersion } from './sources';
import { normalizeWeatherPixel } from './normalize';
import type { WeatherConfig, WeatherSource } from './schema';

const cache = new Map<string, Buffer>();
const MAX_SOURCE_ZOOM = 7;

export function activeWeather(config: WeatherConfig) {
    if (!config.weather.enabled) return [];
    return config.weather.inputs.flatMap((input) => {
        const source = config.sources.find((item) => item.id === input.sourceId);
        return source && source.enabled && input.weight > 0
            ? [{ source, weight: input.weight }]
            : [];
    });
}

type WeightedTile = { png: Buffer; weight: number; type: WeatherSource['type'] };

function sample(png: PNG, x: number, y: number, width: number, height: number) {
    const sx = Math.min(png.width - 1, Math.floor((x * png.width) / width));
    const sy = Math.min(png.height - 1, Math.floor((y * png.height) / height));
    const offset = (png.width * sy + sx) << 2;
    return [
        png.data[offset] ?? 0,
        png.data[offset + 1] ?? 0,
        png.data[offset + 2] ?? 0,
        png.data[offset + 3] ?? 0,
    ] as const;
}

type RGB = [number, number, number];
const PALETTE: Array<{ stop: number; color: RGB }> = [
    { stop: 0, color: [155, 220, 247] },
    { stop: 0.4, color: [0, 128, 0] },
    { stop: 1.5, color: [124, 252, 0] },
    { stop: 3, color: [255, 210, 31] },
    { stop: 8, color: [255, 140, 0] },
    { stop: 20, color: [240, 68, 36] },
    { stop: 50, color: [139, 0, 139] },
    { stop: 100, color: [18, 59, 155] },
];

function interpolateColor(a: RGB, b: RGB, factor: number): RGB {
    return [
        Math.round(a[0] + (b[0] - a[0]) * factor),
        Math.round(a[1] + (b[1] - a[1]) * factor),
        Math.round(a[2] + (b[2] - a[2]) * factor),
    ];
}

function precipitationColor(rate: number): RGB {
    if (rate <= 0) return PALETTE[0].color;
    const last = PALETTE[PALETTE.length - 1];
    if (rate >= last.stop) return last.color;

    for (let index = 0; index < PALETTE.length - 1; index += 1) {
        const current = PALETTE[index];
        const next = PALETTE[index + 1];
        if (rate >= current.stop && rate <= next.stop) {
            const factor = (rate - current.stop) / (next.stop - current.stop || 1);
            return interpolateColor(current.color, next.color, factor);
        }
    }
    return PALETTE[0].color;
}

function emptyTile(): Buffer {
    return PNG.sync.write(new PNG({ width: 256, height: 256 }));
}

function composeNormalizedWeather(tiles: WeightedTile[]): Buffer {
    const images = tiles.flatMap((tile) => {
        try {
            const png = PNG.sync.read(tile.png);
            return tile.weight > 0 ? [{ png, weight: tile.weight }] : [];
        } catch {
            return [];
        }
    });
    if (images.length === 0) return emptyTile();

    const width = images[0]?.png.width ?? 256;
    const height = images[0]?.png.height ?? 256;
    const totalWeight = images.reduce((sum, image) => sum + image.weight, 0);
    const output = new PNG({ width, height });

    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            let wetWeight = 0;
            let weightedRate = 0;
            for (const image of images) {
                const pixel = normalizeWeatherPixel(...sample(image.png, x, y, width, height));
                if (pixel.isWet) wetWeight += image.weight;
                weightedRate += pixel.precipitationRate * image.weight;
            }

            const probability = totalWeight ? wetWeight / totalWeight : 0;
            const rate = totalWeight ? weightedRate / totalWeight : 0;
            const offset = (width * y + x) << 2;
            if (probability < 0.2 || rate <= 0) {
                output.data[offset + 3] = 0;
                continue;
            }

            const [r, g, b] = precipitationColor(rate);
            output.data[offset] = r;
            output.data[offset + 1] = g;
            output.data[offset + 2] = b;
            output.data[offset + 3] = Math.round(255 * Math.min(1, 0.32 + probability * 0.76));
        }
    }
    return PNG.sync.write(output);
}

function cropAndScaleTile(sourceBytes: Buffer, z: number, x: number, y: number): Buffer {
    const source = PNG.sync.read(sourceBytes);
    const scale = 2 ** (z - MAX_SOURCE_ZOOM);
    const offsetX = ((x % scale) * source.width) / scale;
    const offsetY = ((y % scale) * source.height) / scale;
    const cropWidth = source.width / scale;
    const cropHeight = source.height / scale;
    const output = new PNG({ width: 256, height: 256 });

    for (let py = 0; py < output.height; py += 1) {
        const sourceY = Math.max(
            0,
            Math.min(source.height - 1, offsetY + ((py + 0.5) * cropHeight) / output.height - 0.5),
        );
        const y0 = Math.floor(sourceY);
        const y1 = Math.min(source.height - 1, y0 + 1);
        const fy = sourceY - y0;

        for (let px = 0; px < output.width; px += 1) {
            const sourceX = Math.max(
                0,
                Math.min(source.width - 1, offsetX + ((px + 0.5) * cropWidth) / output.width - 0.5),
            );
            const x0 = Math.floor(sourceX);
            const x1 = Math.min(source.width - 1, x0 + 1);
            const fx = sourceX - x0;
            const destination = (output.width * py + px) << 2;

            for (let channel = 0; channel < 4; channel += 1) {
                const topLeft = source.data[(source.width * y0 + x0) * 4 + channel] ?? 0;
                const topRight = source.data[(source.width * y0 + x1) * 4 + channel] ?? 0;
                const bottomLeft = source.data[(source.width * y1 + x0) * 4 + channel] ?? 0;
                const bottomRight = source.data[(source.width * y1 + x1) * 4 + channel] ?? 0;
                const top = topLeft + (topRight - topLeft) * fx;
                const bottom = bottomLeft + (bottomRight - bottomLeft) * fx;
                output.data[destination + channel] = Math.round(top + (bottom - top) * fy);
            }
        }
    }
    return PNG.sync.write(output);
}

export async function composeWeatherTile(z: number, x: number, y: number): Promise<Buffer> {
    const config = getWeatherConfig();
    const inputs = activeWeather(config);
    if (!inputs.length) return emptyTile();

    const key = `${getWeatherConfigVersion()}:${getRadarCacheVersion()}:${z}:${x}:${y}`;
    const hit = cache.get(key);
    if (hit) return hit;

    if (z > MAX_SOURCE_ZOOM) {
        const scale = 2 ** (z - MAX_SOURCE_ZOOM);
        const parentX = Math.floor(x / scale);
        const parentY = Math.floor(y / scale);
        const parent = await composeWeatherTile(MAX_SOURCE_ZOOM, parentX, parentY);
        const result = cropAndScaleTile(parent, z, x, y);
        cache.set(key, result);
        if (cache.size > 400) cache.delete(cache.keys().next().value as string);
        return result;
    }

    const fetched = await Promise.all(
        inputs.map(async (input) => {
            const png = await fetchSourcePng(input.source, z, x, y);
            return png ? { png, weight: input.weight, type: input.source.type } : null;
        }),
    );
    const tiles = fetched.filter((tile): tile is NonNullable<typeof tile> => tile !== null);
    const result = tiles.length ? composeNormalizedWeather(tiles) : emptyTile();
    cache.set(key, result);
    if (cache.size > 400) cache.delete(cache.keys().next().value as string);
    return result;
}
