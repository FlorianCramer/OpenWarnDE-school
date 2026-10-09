import { errorResponse, json } from '@/lib/http';
import { composeWeatherTile } from '@/lib/weather/compose';
import { publicWeather } from '@/lib/weather/public';
import { getWeatherConfig } from '@/lib/weather/store';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
function tileCoordinates(search: URLSearchParams) {
    const rawZoom = search.get('z');
    const rawX = search.get('x');
    const rawY = search.get('y');
    if (rawZoom === null && rawX === null && rawY === null) return null;
    if (
        rawZoom === null ||
        rawX === null ||
        rawY === null ||
        !/^\d+$/.test(rawZoom) ||
        !/^\d+$/.test(rawX) ||
        !/^\d+$/.test(rawY)
    ) {
        return { error: 'z, x und y müssen gültige Kachelkoordinaten sein' };
    }

    const z = Number(rawZoom);
    const x = Number(rawX);
    const y = Number(rawY);
    if (z > 20 || x >= 2 ** z || y >= 2 ** z) {
        return { error: 'Ungültige Wetterkachel' };
    }
    return { z, x, y };
}

export async function GET(request: Request) {
    try {
        const search = new URL(request.url).searchParams;
        const coordinates = tileCoordinates(search);
        if (coordinates) {
            if ('error' in coordinates) return json({ error: coordinates.error }, 400);
            const png = await composeWeatherTile(coordinates.z, coordinates.x, coordinates.y);
            return new Response(new Uint8Array(png), {
                headers: {
                    'Content-Type': 'image/png',
                    'Cache-Control': 'public, max-age=120',
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }
        return json({ weather: publicWeather(getWeatherConfig(), new URL(request.url).origin) });
    } catch (error) {
        return errorResponse(error);
    }
}
