import { PNG } from 'pngjs';

export type WeightedPng = {
    png: Buffer;
    weight: number;
};

interface Decoded {
    width: number;
    height: number;
    data: Uint8Array;
    weight: number;
    png: Buffer;
}

function decode(tile: WeightedPng): Decoded | null {
    try {
        const png = PNG.sync.read(tile.png);
        return {
            width: png.width,
            height: png.height,
            data: png.data,
            weight: tile.weight,
            png: tile.png,
        };
    } catch {
        return null;
    }
}

function sample(image: Decoded, x: number, y: number, width: number, height: number) {
    const sx = Math.min(image.width - 1, Math.floor((x * image.width) / width));
    const sy = Math.min(image.height - 1, Math.floor((y * image.height) / height));
    const index = (image.width * sy + sx) << 2;
    return [
        image.data[index] ?? 0,
        image.data[index + 1] ?? 0,
        image.data[index + 2] ?? 0,
        image.data[index + 3] ?? 0,
    ] as const;
}

/**
 * Mischt schon eingefärbte Kacheln nach Gewicht.
 * Transparente Pixel gelten als "keine Daten" und fallen aus der Mittelung.
 * Das ist eine Farbmischung, keine Umrechnung physikalischer Messwerte.
 */
export function blendWeightedPngs(tiles: WeightedPng[]): Buffer {
    const images = tiles.flatMap((tile) => {
        const decoded = decode(tile);
        return decoded && decoded.weight > 0 ? [decoded] : [];
    });
    if (images.length === 0) return emptyTile();
    if (images.length === 1) return images[0].png;

    const width = images[0]?.width ?? 256;
    const height = images[0]?.height ?? 256;
    const out = new PNG({ width, height });

    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            let red = 0;
            let green = 0;
            let blue = 0;
            let covered = 0;
            let weightSum = 0;

            for (const image of images) {
                const [r, g, b, a] = sample(image, x, y, width, height);
                if (a === 0) continue;
                const contribution = image.weight * (a / 255);
                red += r * contribution;
                green += g * contribution;
                blue += b * contribution;
                covered += contribution;
                weightSum += image.weight;
            }

            const index = (width * y + x) << 2;
            if (covered <= 0 || weightSum <= 0) {
                out.data[index + 3] = 0;
                continue;
            }
            out.data[index] = Math.round(red / covered);
            out.data[index + 1] = Math.round(green / covered);
            out.data[index + 2] = Math.round(blue / covered);
            out.data[index + 3] = Math.round(Math.min(1, covered / weightSum) * 255);
        }
    }

    return PNG.sync.write(out);
}

export function emptyTile(): Buffer {
    return PNG.sync.write(new PNG({ width: 256, height: 256 }));
}
