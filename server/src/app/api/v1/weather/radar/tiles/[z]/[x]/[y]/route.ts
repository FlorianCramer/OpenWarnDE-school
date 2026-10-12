import { createHash } from 'node:crypto';
import { corsHeaders } from '@/lib/http';
import { composeWeatherTile } from '@/lib/weather/compose';
import { getRadarMetadata, validRadarCoordinate } from '@/lib/weather/radar';
import { getWeatherConfig } from '@/lib/weather/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function parseCoordinate(value: string) {
    return /^\d+$/.test(value) ? Number(value) : null;
}

export async function GET(
    request: Request,
    context: { params: Promise<{ z: string; x: string; y: string }> },
) {
    const { z: rawZ, x: rawX, y: rawY } = await context.params;
    const z = parseCoordinate(rawZ);
    const x = parseCoordinate(rawX);
    const y = parseCoordinate(rawY.replace(/\.png$/, ''));
    if (z === null || x === null || y === null || !validRadarCoordinate(z, x, y)) {
        return Response.json(
            { error: 'Ungültige Radar-Tile-Koordinaten' },
            { status: 400, headers: corsHeaders(request) },
        );
    }

    const metadata = await getRadarMetadata(getWeatherConfig(), new URL(request.url).origin);
    if (metadata.status === 'unavailable') {
        return Response.json(metadata, {
            status: 503,
            headers: { ...corsHeaders(request), 'Cache-Control': 'no-store' },
        });
    }

    const png = await composeWeatherTile(z, x, y);
    const etag = `"${createHash('sha1').update(png).digest('hex')}"`;
    const requestEtags =
        request.headers
            .get('if-none-match')
            ?.split(',')
            .map((value) => value.trim()) ?? [];
    const matches = requestEtags.some(
        (value) => value === etag || value === etag.slice(1, -1) || value === `W/${etag}`,
    );
    if (matches) {
        return new Response(null, {
            status: 304,
            headers: { ...corsHeaders(request), ETag: etag },
        });
    }
    return new Response(new Uint8Array(png), {
        headers: {
            ...corsHeaders(request),
            'Content-Type': 'image/png',
            ETag: etag,
            'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
            Vary: 'Origin, Accept-Encoding',
        },
    });
}
