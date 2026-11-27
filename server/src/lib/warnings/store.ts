import fs from 'node:fs';
import path from 'node:path';
import { warningSchema, type Warning, type WarningInput } from './model';

const file = path.join(process.cwd(), 'data', 'warnings.json');

const read = (): Warning[] => {
    if (!fs.existsSync(file)) return [];
    const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as unknown;
    if (!Array.isArray(raw)) throw new Error('server/data/warnings.json ist ungültig');
    return raw.map((item) => warningSchema.parse(item));
};

const write = (warnings: Warning[]) => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(warnings, null, 2));
};

const identifier = () => `warning-${crypto.randomUUID().slice(0, 12)}`;

export const listWarnings = (publicOnly = false) => {
    const warnings = read();
    return publicOnly
        ? warnings.filter((warning) => warning.status === 'published' && warning.visible)
        : warnings;
};

export const createWarning = (input: WarningInput) => {
    const now = new Date().toISOString();
    const warning = warningSchema.parse({
        ...input,
        id: identifier(),
        createdAt: now,
        updatedAt: now,
        publishedAt: null,
    });
    const warnings = read();
    warnings.push(warning);
    write(warnings);
    return warning;
};

export const updateWarning = (id: string, input: WarningInput) => {
    const warnings = read();
    const index = warnings.findIndex((warning) => warning.id === id);
    if (index < 0) return null;
    const current = warnings[index];
    const next = warningSchema.parse({
        ...input,
        id,
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString(),
        publishedAt: current.publishedAt,
    });
    warnings[index] = next;
    write(warnings);
    return next;
};

export const publishWarning = (id: string) => {
    const warnings = read();
    const index = warnings.findIndex((warning) => warning.id === id);
    if (index < 0) return null;
    const now = new Date().toISOString();
    warnings[index] = warningSchema.parse({
        ...warnings[index],
        status: 'published',
        publishedAt: now,
        updatedAt: now,
    });
    write(warnings);
    return warnings[index];
};
