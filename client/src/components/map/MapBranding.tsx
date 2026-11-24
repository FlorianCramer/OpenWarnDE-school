import { useState } from 'react';
import { useWeather } from './WeatherContext';
import { Copyright } from 'lucide-react';
export default function MapBranding() {
    const [open, setOpen] = useState(false);
    const { weather } = useWeather();
    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="pointer-events-auto absolute bottom-5 left-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[10px] font-bold tracking-tight text-sky-700 shadow-lg md:bottom-7 md:left-24"
                aria-label="OpenWarnDE Copyright anzeigen"
            >
                <Copyright className="h-5 w-5" aria-hidden="true" />
            </button>
            {open && (
                <div
                    className="pointer-events-auto absolute bottom-20 left-5 z-30 w-[min(360px,calc(100vw-2.5rem))] rounded-2xl bg-white p-5 text-sm text-slate-700 shadow-2xl md:bottom-24 md:left-7"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Copyright und Quellen"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold">Copyright & Quellen</h2>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100"
                            aria-label="Modal schließen"
                        >
                            ×
                        </button>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed">
                        Kartendaten © OpenStreetMap contributors. Wetter- und Radardaten:{' '}
                        {weather?.attribution ?? 'Datenquelle laut API-Konfiguration'}. OpenWarnDE
                        ist ein Prototyp.
                    </p>
                </div>
            )}
        </>
    );
}
