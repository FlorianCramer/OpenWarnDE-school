export interface ServerLayer {
    id: string;
    name: string;
    basemap: {
        url: string;
        attribution: string;
        maxZoom: number;
    };
    weather: {
        url: string;
        opacity: number;
        attribution: string;
    } | null;
}

export function apiOrigin() {
    return process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3001';
}
