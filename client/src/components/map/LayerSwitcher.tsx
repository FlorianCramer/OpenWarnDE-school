'use client';

import { useLayers } from './LayerContext';

export default function LayerSwitcher() {
    const { layers, active, setActive, loading, error } = useLayers();

    return (
        <div
            style={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 1000,
                background: 'white',
                padding: 12,
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                fontFamily: 'system-ui, sans-serif',
                minWidth: 200,
            }}
        >
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Karte</div>
            {loading ? <div>Layer werden geladen…</div> : null}
            {error ? <div>{error}</div> : null}
            {layers.map((layer) => (
                <label key={layer.id} style={{ display: 'block', cursor: 'pointer' }}>
                    <input
                        type="radio"
                        name="map-layer"
                        checked={active?.id === layer.id}
                        onChange={() => setActive(layer.id)}
                    />{' '}
                    {layer.name}
                </label>
            ))}
        </div>
    );
}
