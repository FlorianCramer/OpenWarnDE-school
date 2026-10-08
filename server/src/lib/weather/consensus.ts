import { PNG } from 'pngjs';
import type { WeatherSource } from './schema';
export type WeightedTile = { png: Buffer; weight: number; type: WeatherSource['type'] };

type Image = { width: number; height: number; data: Uint8Array; weight: number };

function decode(tile: WeightedTile): Image | null {
    try {
        const png = PNG.sync.read(tile.png);
        return { width: png.width, height: png.height, data: png.data, weight: tile.weight };
    } catch {
        return null;
    }
}
function sample(image: Image, x: number, y: number, w: number, h: number) {
    const sx = Math.min(image.width - 1, Math.floor((x * image.width) / w));
    const sy = Math.min(image.height - 1, Math.floor((y * image.height) / h));
    const i = (image.width * sy + sx) << 2;
    return [
        image.data[i] ?? 0,
        image.data[i + 1] ?? 0,
        image.data[i + 2] ?? 0,
        image.data[i + 3] ?? 0,
    ] as const;
}
function rainRate([r, g, b, a]: readonly [number, number, number, number]) {
    if (a === 0) return 0;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max < 180 && max - min < 35) return 0;
    if (r > 210 && g < 120) return 40;
    if (r > 180 && g > 90 && g < 210 && b < 100) return 15;
    if (r > 180 && g > 170 && b < 110) return 6;
    if (b > r * 1.25 && b > g * 1.05) return g > 100 ? 2 : 0.5;
    if (g > r * 1.15 && g > b * 1.05) return 3;
    return b > r && b > g ? 1 : 0;
}
function color(rate: number) {
    return rate >= 30
        ? [240, 68, 36]
        : rate >= 10
          ? [255, 210, 31]
          : rate >= 3
            ? [18, 59, 155]
            : rate >= 1
              ? [47, 128, 237]
              : [155, 220, 247];
}
/** Farbe encodiert die gemeinsame Intensitätsklasse; Alpha encodiert Quellenkonsens. */
export function composeConsensusTile(tiles: WeightedTile[]) {
    const images = tiles.flatMap((tile) => {
        const image = decode(tile);
        return image && image.weight > 0 ? [image] : [];
    });
    if (!images.length) return emptyTile();
    const width = images[0]?.width ?? 256;
    const height = images[0]?.height ?? 256;
    const total = images.reduce((sum, image) => sum + image.weight, 0);
    const out = new PNG({ width, height });
    for (let y = 0; y < height; y += 1)
        for (let x = 0; x < width; x += 1) {
            let wet = 0;
            let weightedRate = 0;
            for (const image of images) {
                const rate = rainRate(sample(image, x, y, width, height));
                if (rate > 0) wet += image.weight;
                weightedRate += rate * image.weight;
            }
            const probability = total ? wet / total : 0;
            const rate = total ? weightedRate / total : 0;
            const i = (width * y + x) << 2;
            if (probability < 0.25 || rate <= 0) {
                out.data[i + 3] = 0;
                continue;
            }
            const [r, g, b] = color(rate);
            out.data[i] = r;
            out.data[i + 1] = g;
            out.data[i + 2] = b;
            out.data[i + 3] = Math.round(255 * Math.min(1, 0.25 + probability * 0.75));
        }
    return PNG.sync.write(out);
}
export function emptyTile() {
    return PNG.sync.write(new PNG({ width: 256, height: 256 }));
}
