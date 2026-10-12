export interface WeatherOverlay {
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
    radar?: RadarMetadata | null;
    detailLevels?: Array<{ id: string; minZoom: number; maxZoom: number }>;
}
export interface RadarMetadata {
    status: 'available';
    product: 'radar';
    timestamp: string;
    updatedAt: string;
    tileSize: number;
    minZoom: number;
    maxZoom: number;
    tileUrl: string;
    bounds: [number, number, number, number] | null;
}
export { apiOrigin, apiUrl } from '@/lib/api';
