import { errorResponse, json } from '@/lib/http';
import { getWeatherConfig, saveWeatherConfig } from '@/lib/weather/store';
import { requireAdminKey } from '@/lib/api/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function OPTIONS(request: Request) {
    return json(null, 204, request);
}

export function GET(request: Request) {
    try {
        if (!requireAdminKey(request))
            return json({ error: 'Admin API-Key erforderlich' }, 401, request);
        const config = getWeatherConfig();
        return json(
            {
                ...config,
                sources: config.sources.map((source) => ({
                    ...source,
                    apiKey: source.apiKey ? '••••••••' : '',
                })),
            },
            200,
            request,
        );
    } catch (error) {
        return errorResponse(error, request);
    }
}

export async function PUT(request: Request) {
    try {
        if (!requireAdminKey(request))
            return json({ error: 'Admin API-Key erforderlich' }, 401, request);
        const body = await request.json();
        const current = getWeatherConfig();
        const next =
            body && typeof body === 'object'
                ? {
                      ...body,
                      sources: Array.isArray((body as { sources?: unknown[] }).sources)
                          ? (body as { sources: Array<Record<string, unknown>> }).sources.map(
                                (source) => ({
                                    ...source,
                                    apiKey:
                                        source.apiKey === '••••••••'
                                            ? (current.sources.find((item) => item.id === source.id)
                                                  ?.apiKey ?? '')
                                            : source.apiKey,
                                }),
                            )
                          : undefined,
                  }
                : body;
        const saved = saveWeatherConfig(next);
        return json(
            {
                ...saved,
                sources: saved.sources.map((source) => ({
                    ...source,
                    apiKey: source.apiKey ? '••••••••' : '',
                })),
            },
            200,
            request,
        );
    } catch (error) {
        return errorResponse(error, request);
    }
}
