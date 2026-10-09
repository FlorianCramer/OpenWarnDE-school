export const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8080';

export function apiUrl(path: string) {
    return `${apiOrigin}${path.startsWith('/') ? path : `/${path}`}`;
}
