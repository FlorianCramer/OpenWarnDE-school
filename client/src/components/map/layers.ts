// components/map/layers.ts
export type BaseLayerId = 'osm' | 'topo' | 'satellite';

export interface BaseLayer {
    id: BaseLayerId;
    name: string;
    url: string;
    attribution: string;
    maxZoom?: number;
}

export const BASE_LAYERS: Record<BaseLayerId, BaseLayer> = {
    osm: {
        id: 'osm',
        name: 'Standard (OSM)',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    topo: {
        id: 'topo',
        name: 'Topografie',
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution:
            'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
        maxZoom: 17,
    },
    satellite: {
        id: 'satellite',
        name: 'Satellit',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
        maxZoom: 19,
    },
};
