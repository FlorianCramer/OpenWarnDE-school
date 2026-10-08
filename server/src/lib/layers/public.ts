import type { AppConfig, DataSource, MapLayer } from './schema';

export interface PublicLayer {
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

function activeInputs(layer: MapLayer, sources: DataSource[]) {
    return layer.weather.inputs.flatMap((input) => {
        if (input.weight <= 0) return [];
        const source = sources.find((item) => item.id === input.sourceId);
        if (!source?.enabled) return [];
        return [{ source, weight: input.weight }];
    });
}

function sourceCredit(source: DataSource) {
    if (source.type === 'openweathermap') return 'OpenWeatherMap';
    if (source.type === 'rainviewer') return 'RainViewer';
    return source.name;
}

/** Öffentliche Layerliste. API-Keys und Quell-URLs bleiben auf dem Server. */
export function toPublicLayers(config: AppConfig, origin: string): PublicLayer[] {
    return config.layers
        .filter((layer) => layer.enabled)
        .map((layer) => {
            const inputs = activeInputs(layer, config.sources);
            const credits = [...new Set(inputs.map((input) => sourceCredit(input.source)))];
            return {
                id: layer.id,
                name: layer.name,
                basemap: {
                    url: layer.basemap.urlTemplate,
                    attribution: layer.basemap.attribution,
                    maxZoom: layer.basemap.maxZoom,
                },
                weather:
                    inputs.length === 0
                        ? null
                        : {
                              url: `${origin}/api/v1/tiles/${layer.id}/{z}/{x}/{y}`,
                              opacity: layer.weather.opacity,
                              attribution: credits.join(', '),
                          },
            };
        });
}

export function activeWeatherInputs(config: AppConfig, layerId: string) {
    const layer = config.layers.find((item) => item.id === layerId && item.enabled);
    if (!layer) return null;
    return activeInputs(layer, config.sources);
}
