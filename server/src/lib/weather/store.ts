import fs from 'node:fs';
import path from 'node:path';
import { defaultWeatherConfig } from './defaults';
import { configSchema, type WeatherConfig } from './schema';

const FILE = path.join(process.cwd(), 'data', 'weather.json');
let cached: WeatherConfig | null = null;
let version = 1;
export function getWeatherConfig() {
    if (cached) return cached;
    if (!fs.existsSync(FILE)) return (cached = defaultWeatherConfig());
    const parsed = configSchema.safeParse(JSON.parse(fs.readFileSync(FILE, 'utf8')));
    if (!parsed.success) throw new Error('server/data/weather.json ist ungültig');
    return (cached = parsed.data);
}
export function getWeatherConfigVersion() {
    return version;
}
export function saveWeatherConfig(input: unknown) {
    const parsed = configSchema.parse(input);
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(parsed, null, 2));
    cached = parsed;
    version += 1;
    return parsed;
}
