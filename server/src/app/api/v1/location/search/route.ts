import { errorResponse, json } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type SearchEntry = {
    display_name?: string;
    displayName?: string;
    lat?: string | number;
    lon?: string | number;
    geometry?: { coordinates?: [number, number] };
};

const requestSearch = async (url: string) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
        const response = await fetch(url, {
            headers: { Accept: 'application/json', 'User-Agent': 'OpenWarnDE/2.0' },
            signal: controller.signal,
            cache: 'no-store',
        });
        if (!response.ok) return null;
        return (await response.json()) as SearchEntry[];
    } catch {
        return null;
    } finally {
        clearTimeout(timeout);
    }
};

export async function GET(request: Request) {
    try {
        const query = new URL(request.url).searchParams.get('q')?.trim();
        if (!query || query.length < 2) return json({ results: [] }, 200, request);
        const nominatimEntries = await requestSearch(
            `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=de&addressdetails=1&q=${encodeURIComponent(query)}`,
        );
        const entries =
            nominatimEntries ??
            (await requestSearch(
                `https://photon.komoot.io/api/?limit=5&q=${encodeURIComponent(query)}`,
            ));
        if (!entries) return json({ error: 'Suchdienst nicht erreichbar' }, 502, request);
        return json(
            {
                results: entries.flatMap((entry) => {
                    const coordinates = entry.geometry?.coordinates;
                    const latitude = coordinates ? coordinates[1] : Number(entry.lat);
                    const longitude = coordinates ? coordinates[0] : Number(entry.lon);
                    const displayName = entry.display_name ?? entry.displayName;
                    return displayName && Number.isFinite(latitude) && Number.isFinite(longitude)
                        ? [{ displayName, latitude, longitude }]
                        : [];
                }),
            },
            200,
            request,
        );
    } catch (error) {
        return errorResponse(error, request);
    }
}
