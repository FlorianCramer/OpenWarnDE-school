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
export { apiOrigin, apiUrl } from '@/lib/api';
