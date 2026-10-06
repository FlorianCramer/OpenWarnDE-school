// components/map/LayerSwitcher.tsx
'use client';

import { BASE_LAYERS, type BaseLayerId } from './layers';
import { OVERLAYS, type OverlayId } from './overlays';
import { useLayers } from './LayerContext';

export default function LayerSwitcher() {
    const { baseLayer, setBaseLayer, toggleOverlay, isOverlayActive } = useLayers();

    return (
        <div
            style={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 1000, // über Leaflet
                background: 'white',
                padding: 12,
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                fontFamily: 'system-ui, sans-serif',
                minWidth: 200,
            }}
        >
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Basis-Karte</div>
            {(Object.keys(BASE_LAYERS) as BaseLayerId[]).map((id) => (
                <label key={id} style={{ display: 'block', cursor: 'pointer' }}>
                    <input
                        type="radio"
                        name="base"
                        checked={baseLayer.id === id}
                        onChange={() => setBaseLayer(id)}
                    />{' '}
                    {BASE_LAYERS[id].name}
                </label>
            ))}

            <div style={{ fontWeight: 600, margin: '10px 0 6px' }}>Overlays</div>
            {(Object.keys(OVERLAYS) as OverlayId[]).map((id) => (
                <label key={id} style={{ display: 'block', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={isOverlayActive(id)}
                        onChange={() => toggleOverlay(id)}
                    />{' '}
                    {OVERLAYS[id].name}
                </label>
            ))}
        </div>
    );
}
