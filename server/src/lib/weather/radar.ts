import { activeWeather } from './compose';
import { getRainViewerMetadata, getRadrViewMetadata } from './sources';
import type { WeatherConfig } from './schema';

export const RADAR_TILE_SIZE = 256;
export const RADAR_MIN_ZOOM = 4;
export const RADAR_MAX_ZOOM = 22;

export type RadarMetadata = {
    status: 'available';
    product: 'radar';
    timestamp: string;
    updatedAt: string;
    tileSize: number;
    minZoom: number;
    maxZoom: number;
    tileUrl: string;
    bounds: null;
};

export type RadarUnavailable = {
    status: 'unavailable';
    product: 'radar';
    reason: 'disabled' | 'no-source' | 'source-unavailable';
};

export async function getRadarMetadata(config: WeatherConfig, origin: string) {
    if (!config.weather.enabled) {
        return {
            status: 'unavailable',
            product: 'radar',
            reason: 'disabled',
        } satisfies RadarUnavailable;
    }

    const radarInput = activeWeather(config).find(
        ({ source }) => source.type === 'rainviewer' || source.type === 'radrview',
    );
    if (!radarInput) {
        return {
            status: 'unavailable',
            product: 'radar',
            reason: 'no-source',
        } satisfies RadarUnavailable;
    }

    const sourceMetadata =
        radarInput.source.type === 'rainviewer'
            ? await getRainViewerMetadata()
            : await getRadrViewMetadata(
                  radarInput.source.urlTemplate || 'https://radrview.com',
                  radarInput.source.product || 'composite',
              );
    if (!sourceMetadata) {
        return {
            status: 'unavailable',
            product: 'radar',
            reason: 'source-unavailable',
        } satisfies RadarUnavailable;
    }

    return {
        status: 'available',
        product: 'radar',
        timestamp: sourceMetadata.timestamp,
        updatedAt: sourceMetadata.updatedAt,
        tileSize: RADAR_TILE_SIZE,
        minZoom: RADAR_MIN_ZOOM,
        maxZoom: RADAR_MAX_ZOOM,
        tileUrl: `${origin}/api/v1/weather/radar/tiles/{z}/{x}/{y}.png`,
        // Configured sources do not expose a trustworthy product extent.
        bounds: null,
    } satisfies RadarMetadata;
}

export function validRadarCoordinate(z: number, x: number, y: number) {
    return (
        Number.isSafeInteger(z) &&
        Number.isSafeInteger(x) &&
        Number.isSafeInteger(y) &&
        z >= RADAR_MIN_ZOOM &&
        z <= RADAR_MAX_ZOOM &&
        x >= 0 &&
        y >= 0 &&
        x < 2 ** z &&
        y < 2 ** z
    );
}
