import { timingSafeEqual } from 'node:crypto';
import { firebaseAuth, firestore } from '@/lib/firebase';
import { hasServerFirebase } from '@/lib/firebase';

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

export async function requireAdminAccess(request: Request) {
    if (!hasServerFirebase) return requireAdminKey(request);
    const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (token) {
        try {
            const decoded = await firebaseAuth.verifyIdToken(token);
            const profile = await firestore.collection('user').doc(decoded.uid).get();
            const data = profile.data() as { role?: string; active?: boolean } | undefined;
            return profile.exists && data?.active === true && ['admin', 'dev'].includes(data.role ?? '');
        } catch {
            return false;
        }
    }
    return requireAdminKey(request);
}
