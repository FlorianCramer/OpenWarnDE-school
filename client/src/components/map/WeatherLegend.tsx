'use client';
import { useWeather } from './WeatherContext';
export default function WeatherLegend() {
    const { weather, loading, error } = useWeather();
    if (loading || !weather)
        return error ? (
            <div
                style={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    zIndex: 1000,
                    background: 'white',
                    padding: 8,
                    borderRadius: 6,
                }}
            >
                {error}
            </div>
        ) : null;
    return (
        <div
            style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                zIndex: 1000,
                background: 'rgba(255,255,255,.94)',
                padding: 10,
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,.2)',
                font: '12px system-ui',
            }}
        >
            <div style={{ fontWeight: 700, marginBottom: 5 }}>Regenintensität</div>
            {weather.legend.map((item) => (
                <div key={item.color} title={`${item.radar} · ${item.description}`} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                        style={{
                            width: 14,
                            height: 10,
                            background: item.color,
                            display: 'inline-block',
                        }}
                    />
                    <span><strong>{item.name}</strong> · {item.precipitation} · {item.intensity}</span>
                </div>
            ))}
        </div>
    );
}
