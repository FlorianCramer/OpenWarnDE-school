export interface WeatherOverlay {
    url: string;
    opacity: number;
    attribution: string;
    legend: { color: string; label: string }[];
}
export function apiOrigin() {
    return process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3001';
}
