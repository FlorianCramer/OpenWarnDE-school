/* Legacy endpoint intentionally returns 410; the public API is weather-only. */
import { json } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
    return json(
        { error: 'Diese API stellt nur noch den Wetterlayer bereit. Nutze /api/v1/weather.' },
        410,
    );
    /*
    try {
        const origin = new URL(request.url).origin;
        return json({ layers: toPublicLayers(getConfig(), origin) });
    } catch (error) {
        return errorResponse(error);
    }
    */
}
