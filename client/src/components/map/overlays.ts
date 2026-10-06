// components/map/overlays.ts
export type OverlayId = 'weather-precip' | 'weather-clouds' | 'weather-temp';

export interface Overlay {
    id: OverlayId;
    name: string;
    url: string;
    opacity?: number;
    attribution?: string;
}

// OpenWeatherMap-Beispiel – API-Key nötig!
const OWM_KEY = process.env.NEXT_PUBLIC_OWM_KEY ?? '';

export const OVERLAYS: Record<OverlayId, Overlay> = {
    'weather-precip': {
        id: 'weather-precip',
        name: 'Niederschlag',
        url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
        opacity: 0.7,
        attribution: '&copy; OpenWeatherMap',
    },
    'weather-clouds': {
        id: 'weather-clouds',
        name: 'Wolken',
        url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
        opacity: 0.6,
        attribution: '&copy; OpenWeatherMap',
    },
    'weather-temp': {
        id: 'weather-temp',
        name: 'Temperatur',
        url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
        opacity: 0.6,
        attribution: '&copy; OpenWeatherMap',
    },
};
