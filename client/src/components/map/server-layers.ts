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

export { apiOrigin, apiUrl } from '@/lib/api';
