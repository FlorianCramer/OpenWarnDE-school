import { activeWeather } from './public';
import { getWeatherConfig, getWeatherConfigVersion } from './store';
import { composeConsensusTile, emptyTile } from './consensus';
import { fetchSourcePng } from './sources';

const cache = new Map<string, Buffer>();

export async function composeWeatherTile(z: number, x: number, y: number) {
    const config = getWeatherConfig();
    const inputs = activeWeather(config);
    if (!inputs.length) return emptyTile();
    const key = `${getWeatherConfigVersion()}:${z}:${x}:${y}`;
    const hit = cache.get(key);
    if (hit) return hit;
    const fetched = await Promise.all(
        inputs.map(async (input) => {
            const png = await fetchSourcePng(input.source, z, x, y);
            return png ? { png, weight: input.weight, type: input.source.type } : null;
        }),
    );
    const tiles = fetched.filter((tile): tile is NonNullable<typeof tile> => tile !== null);
    const result = tiles.length ? composeConsensusTile(tiles) : emptyTile();
    cache.set(key, result);
    if (cache.size > 400) cache.delete(cache.keys().next().value as string);
    return result;
}
