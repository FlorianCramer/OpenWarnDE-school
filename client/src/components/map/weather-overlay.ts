export interface WeatherOverlay {
    url: string;
    tileUrl?: string;
    opacity: number;
    attribution: string;
    legend: {
        color: string;
        name: string;
        label: string;
        radar: string;
        intensity: string;
        precipitation: string;
        description: string;
    }[];
    mode?: 'raster' | 'vector';
    detailLevels?: Array<{ id: string; minZoom: number; maxZoom: number }>;
}
export function apiOrigin() {
    return process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3001';
}
