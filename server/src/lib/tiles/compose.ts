import { activeWeatherInputs } from '../layers/public';
import { getConfig, getConfigVersion } from '../layers/store';
import { blendWeightedPngs, emptyTile, type WeightedPng } from './blend';
import { fetchSourcePng } from './sources';

const cache = new Map<string, Buffer>();

function remember(key: string, png: Buffer) {
    if (cache.has(key)) cache.delete(key);
    cache.set(key, png);
    if (cache.size > 400) {
        const oldest = cache.keys().next().value;
        if (oldest) cache.delete(oldest);
    }
}

export async function composeLayerTile(layerId: string, z: number, x: number, y: number) {
    const config = getConfig();
    const inputs = activeWeatherInputs(config, layerId);
    if (!inputs) return null;
    if (inputs.length === 0) return emptyTile();

    const key = `${getConfigVersion()}:${layerId}:${z}:${x}:${y}`;
    const hit = cache.get(key);
    if (hit) return hit;

    const fetched = await Promise.all(
        inputs.map(async (input) => {
            const png = await fetchSourcePng(input.source, z, x, y);
            return png ? ({ png, weight: input.weight } as WeightedPng) : null;
        }),
    );
    const tiles = fetched.filter(
        (tile): tile is WeightedPng | null => tile !== null,
    ) as WeightedPng[];
    const blended = tiles.length === 0 ? emptyTile() : blendWeightedPngs(tiles);
    remember(key, blended);
    return blended;
}
