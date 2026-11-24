'use client';
import { CloudRain, Eye, EyeOff } from 'lucide-react';
import { useWeather } from './WeatherContext';
import { useState } from 'react';
export default function InfoPanel() {
    const { weather, loading, error } = useWeather();
    const [minimized, setMinimized] = useState(false);
    const [visible, setVisible] = useState(true);
    if (loading)
        return (
            <div className="absolute bottom-5 right-5 z-10 rounded-3xl bg-white/95 px-5 py-4 text-sm shadow-xl md:bottom-7 md:right-7">
                Wetterdaten werden geladen …
            </div>
        );
    if (!weather)
        return (
            <div
                role="alert"
                className="absolute bottom-5 right-5 z-10 max-w-xs rounded-3xl bg-white/95 px-5 py-4 text-sm shadow-xl md:bottom-7 md:right-7"
            >
                {error ?? 'Keine Wetterdaten verfügbar.'}
            </div>
        );
    if (!visible)
        return (
            <button
                type="button"
                onClick={() => setVisible(true)}
                className="pointer-events-auto absolute bottom-5 right-5 z-10 flex min-h-11 items-center gap-2 rounded-full bg-white/95 px-4 text-xs font-medium text-slate-700 shadow-xl md:bottom-7 md:right-7"
            >
                <Eye className="h-4 w-4" aria-hidden="true" />
                Legende anzeigen
            </button>
        );
    return (
        <section className="absolute bottom-5 right-5 z-10 max-h-[43vh] w-[min(370px,calc(100vw-2.5rem))] overflow-y-auto rounded-[26px] bg-white/95 p-5 text-slate-800 shadow-xl backdrop-blur md:bottom-7 md:right-7 md:p-6">
            <header className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <CloudRain className="h-5 w-5 text-sky-600" aria-hidden="true" />
                    <h2 className="text-base font-semibold">Niederschlagsradar</h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                        Beispiel
                    </span>
                    <button
                        type="button"
                        className="rounded-full px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 md:hidden"
                        onClick={() => setMinimized((value) => !value)}
                        aria-expanded={!minimized}
                    >
                        {minimized ? 'Öffnen' : 'Minimieren'}
                    </button>
                    <button
                        type="button"
                        className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                        onClick={() => setVisible(false)}
                        aria-label="Legende ausblenden"
                    >
                        <EyeOff className="h-4 w-4" />
                    </button>
                </div>
            </header>
            {minimized ? null : (
                <>
                    <p className="mt-2 text-xs text-slate-500">
                        Statische Beispielansicht · keine Live-Daten
                    </p>
                    <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Niederschlagsintensität
                    </h3>
                    <div className="mt-3 space-y-2">
                        {weather.legend.map((item) => (
                            <div key={item.color} className="flex items-center gap-2 text-xs">
                                <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span>
                                    <strong>{item.name}</strong> · {item.precipitation}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between rounded-2xl bg-sky-50 px-3.5 py-3 text-xs">
                        <span className="font-medium text-slate-500">Zeit</span>
                        <span className="font-semibold text-sky-800">
                            {weather.radar?.updatedAt
                                ? new Date(weather.radar.updatedAt).toLocaleString('de-DE')
                                : 'Noch kein API-Abgleich'}
                        </span>
                    </div>
                </>
            )}
        </section>
    );
}
