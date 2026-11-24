'use client';
import { Locate, Minus, Plus } from 'lucide-react';
import { useLocation } from './LocationContext';
const dispatchMapAction = (detail: 'zoom-in' | 'zoom-out') =>
    window.dispatchEvent(new CustomEvent('openwarnde:map-action', { detail }));
export default function MapControls() {
    const { recenterLocation } = useLocation();
    const buttonClass =
        'flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 active:scale-95';
    return (
        <div className="pointer-events-auto absolute bottom-[calc(43vh+1rem)] right-5 z-20 flex flex-col gap-2 md:bottom-7 md:left-7 md:right-auto">
            <button
                className={buttonClass}
                onClick={() => dispatchMapAction('zoom-in')}
                aria-label="Karte vergrößern"
            >
                <Plus className="h-5 w-5" />
            </button>
            <button
                className={buttonClass}
                onClick={recenterLocation}
                aria-label="Auf Standort zentrieren"
            >
                <Locate className="h-5 w-5" />
            </button>
            <button
                className={buttonClass}
                onClick={() => dispatchMapAction('zoom-out')}
                aria-label="Karte verkleinern"
            >
                <Minus className="h-5 w-5" />
            </button>
        </div>
    );
}
