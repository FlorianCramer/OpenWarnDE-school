import fs from 'node:fs';
import path from 'node:path';
import { defaultConfig } from './defaults';
import { appConfigSchema, type AppConfig } from './schema';

const FILE = path.join(process.cwd(), 'data', 'layers.json');

let cached: AppConfig | null = null;
let version = 1;

export function getConfigVersion() {
    return version;
}

export function getConfig(): AppConfig {
    if (cached) return cached;
    if (!fs.existsSync(FILE)) {
        cached = defaultConfig();
        return cached;
    }
    const parsed = appConfigSchema.safeParse(JSON.parse(fs.readFileSync(FILE, 'utf8')));
    if (!parsed.success) {
        throw new Error('server/data/layers.json ist ungültig');
    }
    cached = parsed.data;
    return cached;
}

export function saveConfig(input: unknown): AppConfig {
    const parsed = appConfigSchema.parse(input);
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(parsed, null, 2));
    cached = parsed;
    version += 1;
    return parsed;
}
