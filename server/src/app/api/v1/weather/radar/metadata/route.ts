import { getRadarMetadata } from '@/lib/weather/radar';
import { corsHeaders } from '@/lib/http';
import { getWeatherConfig } from '@/lib/weather/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const metadata = await getRadarMetadata(getWeatherConfig(), new URL(request.url).origin);
    if (metadata.status === 'unavailable') {
        return Response.json(metadata, {
            status: 503,
            headers: { ...corsHeaders(request), 'Cache-Control': 'no-store' },
        });
    }
    return Response.json(metadata, {
        headers: {
            ...corsHeaders(request),
            'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
        },
    });
}
