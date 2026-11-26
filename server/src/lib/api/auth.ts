import { timingSafeEqual } from 'node:crypto';

const configuredKeys = () =>
    (process.env.OPENWARN_API_KEYS ?? '')
        .split(',')
        .map((key) => key.trim())
        .filter(Boolean);

const same = (left: string, right: string) => {
    const a = Buffer.from(left);
    const b = Buffer.from(right);
    return a.length === b.length && timingSafeEqual(a, b);
};

export const hasApiKey = (request: Request) => {
    const keys = configuredKeys();
    if (!keys.length) return false;
    const value =
        request.headers.get('x-api-key') ??
        request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    return Boolean(value && keys.some((key) => same(value, key)));
};

export const requireAdminKey = (request: Request) => {
    const expected = process.env.OPENWARN_ADMIN_API_KEY?.trim();
    if (!expected) return process.env.NODE_ENV !== 'production';
    const value =
        request.headers.get('x-api-key') ??
        request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    return Boolean(value && same(value, expected));
};
