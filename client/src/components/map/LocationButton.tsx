'use client';

import { Locate, LocateFixed, Loader2, AlertCircle, X } from 'lucide-react';
import { useLocation } from './LocationContext';

export default function LocationButton() {
    const {
        location,
        status,
        error,
        requestLocation,
        recenterLocation,
        clearError,
        setDemoLocation,
    } = useLocation();

    const handleClick = () => {
        if (status === 'loading') return;
        if (status === 'success' && location) {
            recenterLocation();
        } else {
            void requestLocation();
        }
    };

    return (
        <div className="absolute bottom-4 right-4 z-10 flex flex-col items-end gap-2 pointer-events-auto">
            {/* Fehlerbenachrichtigung */}
            {status === 'error' && error && (
                <div
                    role="alert"
                    aria-live="assertive"
                    className="flex max-w-sm flex-col gap-2 rounded-lg border border-destructive/20 bg-card p-3 text-card-foreground shadow-lg backdrop-blur-md"
                    style={{ background: 'rgba(255, 255, 255, 0.96)' }}
                >
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 text-destructive font-medium text-xs">
                            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                            <span>Standortermittlung fehlgeschlagen</span>
                        </div>
                        <button
                            type="button"
                            onClick={clearError}
                            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            aria-label="Fehlermeldung schließen"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed">{error}</p>
                    <div className="flex flex-wrap justify-end gap-2 pt-1">
                        <button
                            type="button"
                            onClick={() => setDemoLocation(52.52, 13.405)}
                            className="inline-flex min-h-[32px] items-center rounded border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            title="Setzt einen Test-Standort (Berlin) zur Ansicht auf der Karte"
                        >
                            Test-Standort setzen
                        </button>
                        <button
                            type="button"
                            onClick={() => void requestLocation()}
                            className="inline-flex min-h-[32px] items-center rounded border border-primary/30 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            Erneut versuchen
                        </button>
                    </div>
                </div>
            )}

            {/* Standort-Aktionsbutton */}
            <button
                type="button"
                onClick={handleClick}
                disabled={status === 'loading'}
                aria-busy={status === 'loading'}
                aria-label={
                    status === 'loading'
                        ? 'Standort wird ermittelt…'
                        : status === 'success'
                          ? 'Karte auf eigenen Standort zentrieren'
                          : 'Aktuellen Standort abfragen'
                }
                className={`group flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    status === 'loading'
                        ? 'cursor-wait border-border bg-card/90 text-muted-foreground'
                        : status === 'success'
                          ? 'border-[#006DAA]/40 bg-white text-[#006DAA] hover:bg-[#006DAA]/10 active:bg-[#006DAA]/20'
                          : 'border-border bg-white text-foreground hover:bg-muted active:bg-muted/80'
                }`}
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.94)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                }}
            >
                {status === 'loading' ? (
                    <>
                        <Loader2
                            className="h-5 w-5 animate-spin text-[#006DAA]"
                            aria-hidden="true"
                        />
                        <span className="hidden sm:inline">Ermittle…</span>
                    </>
                ) : status === 'success' ? (
                    <>
                        <LocateFixed
                            className="h-5 w-5 text-[#006DAA]"
                            aria-hidden="true"
                        />
                        <span className="hidden sm:inline">Standort zentrieren</span>
                        <span
                            className="h-2 w-2 rounded-full bg-[#006DAA]"
                            aria-hidden="true"
                            title="Standort aktiv"
                        />
                    </>
                ) : (
                    <>
                        <Locate className="h-5 w-5 text-foreground" aria-hidden="true" />
                        <span className="hidden sm:inline">Standort</span>
                    </>
                )}
            </button>
        </div>
    );
}

