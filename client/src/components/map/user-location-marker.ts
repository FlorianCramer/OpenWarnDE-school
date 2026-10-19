import * as maplibregl from 'maplibre-gl';
import type { Map as MapLibreMap, Marker, GeoJSONSource } from 'maplibre-gl';
import type { UserCoordinates } from '@/lib/geolocation';
import { USER_LOCATION_SVG_STRING } from './UserLocationIcon';

const USER_ACCURACY_SOURCE = 'user-location-accuracy-source';
const USER_ACCURACY_FILL = 'user-location-accuracy-fill';
const USER_ACCURACY_LINE = 'user-location-accuracy-line';

function createGeoJsonCircle(
    center: [number, number],
    radiusInMeters: number,
    points = 64
): GeoJSON.Feature<GeoJSON.Polygon> {
    const coords: [number, number][] = [];
    const km = radiusInMeters / 1000;
    const distanceX = km / (111.32 * Math.cos((center[1] * Math.PI) / 180));
    const distanceY = km / 110.574;

    for (let i = 0; i < points; i++) {
        const theta = (i / points) * (2 * Math.PI);
        const x = distanceX * Math.cos(theta);
        const y = distanceY * Math.sin(theta);
        coords.push([center[0] + x, center[1] + y]);
    }
    coords.push(coords[0]);

    return {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [coords],
        },
        properties: {},
    };
}

export class UserLocationMarkerManager {
    private marker: Marker | null = null;

    update(map: MapLibreMap, location: UserCoordinates) {
        if (!map.isStyleLoaded()) return;

        const coords: [number, number] = [location.longitude, location.latitude];

        // 1. Marker verwalten / aktualisieren
        if (!this.marker) {
            const el = document.createElement('div');
            el.className = 'openwarn-user-location-marker';
            el.setAttribute('role', 'img');
            el.setAttribute('aria-label', 'Dein Standort');
            el.style.width = '48px';
            el.style.height = '64px';
            el.style.cursor = 'pointer';
            el.style.filter = 'drop-shadow(0 2px 4px rgba(22, 53, 74, 0.35))';
            el.innerHTML = USER_LOCATION_SVG_STRING;

            const accuracyText =
                location.accuracy && location.accuracy > 0
                    ? `<div style="font-size: 11px; color: #555; margin-top: 2px;">Genauigkeit: ±${Math.round(
                          location.accuracy
                      )} m</div>`
                    : '';

            const popup = new maplibregl.Popup({
                offset: [0, -58],
                closeButton: true,
                closeOnClick: false,
            }).setHTML(`
                <div style="font-family: system-ui, sans-serif; text-align: center; padding: 2px 4px;">
                    <div style="font-weight: 700; color: #006DAA; font-size: 13px;">Dein Standort</div>
                    ${accuracyText}
                </div>
            `);

            this.marker = new maplibregl.Marker({
                element: el,
                anchor: 'bottom',
                offset: [0, 5],
            })
                .setLngLat(coords)
                .setPopup(popup)
                .addTo(map);
        } else {
            this.marker.setLngLat(coords);
            const accuracyText =
                location.accuracy && location.accuracy > 0
                    ? `<div style="font-size: 11px; color: #555; margin-top: 2px;">Genauigkeit: ±${Math.round(
                          location.accuracy
                      )} m</div>`
                    : '';
            const popup = this.marker.getPopup();
            if (popup) {
                popup.setHTML(`
                    <div style="font-family: system-ui, sans-serif; text-align: center; padding: 2px 4px;">
                        <div style="font-weight: 700; color: #006DAA; font-size: 13px;">Dein Standort</div>
                        ${accuracyText}
                    </div>
                `);
            }
        }

        // 2. Genauigkeitskreis verwalten
        if (location.accuracy && location.accuracy > 0) {
            const circleData = createGeoJsonCircle(coords, location.accuracy);
            const source = map.getSource(USER_ACCURACY_SOURCE) as GeoJSONSource | undefined;

            if (source) {
                source.setData(circleData);
            } else {
                map.addSource(USER_ACCURACY_SOURCE, {
                    type: 'geojson',
                    data: circleData,
                });

                if (!map.getLayer(USER_ACCURACY_FILL)) {
                    map.addLayer({
                        id: USER_ACCURACY_FILL,
                        type: 'fill',
                        source: USER_ACCURACY_SOURCE,
                        paint: {
                            'fill-color': '#006DAA',
                            'fill-opacity': 0.12,
                        },
                    });
                }

                if (!map.getLayer(USER_ACCURACY_LINE)) {
                    map.addLayer({
                        id: USER_ACCURACY_LINE,
                        type: 'line',
                        source: USER_ACCURACY_SOURCE,
                        paint: {
                            'line-color': '#006DAA',
                            'line-opacity': 0.35,
                            'line-width': 1.5,
                        },
                    });
                }
            }
        }
    }

    destroy(map?: MapLibreMap | null) {
        if (this.marker) {
            this.marker.remove();
            this.marker = null;
        }

        if (map && map.isStyleLoaded()) {
            if (map.getLayer(USER_ACCURACY_LINE)) {
                map.removeLayer(USER_ACCURACY_LINE);
            }
            if (map.getLayer(USER_ACCURACY_FILL)) {
                map.removeLayer(USER_ACCURACY_FILL);
            }
            if (map.getSource(USER_ACCURACY_SOURCE)) {
                map.removeSource(USER_ACCURACY_SOURCE);
            }
        }
    }
}

