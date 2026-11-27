import { errorResponse, json } from '@/lib/http';
import { getWeatherConfig, saveWeatherConfig } from '@/lib/weather/store';
import { requireAdminAccess } from '@/lib/api/auth';
import { getFirestoreWeatherConfig, saveFirestoreWeatherConfig } from '@/lib/weather/firestore-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function OPTIONS(request: Request) {
    return json(null, 204, request);
}

export async function GET(request: Request) {
    try {
        if (!(await requireAdminAccess(request)))
            return json({ error: 'Admin API-Key erforderlich' }, 401, request);
        const config = process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_SERVICE_ACCOUNT_JSON
            ? (await getFirestoreWeatherConfig()) ?? getWeatherConfig()
            : getWeatherConfig();
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
        if (!(await requireAdminAccess(request)))
            return json({ error: 'Admin API-Key erforderlich' }, 401, request);
        const body = await request.json();
        const current = process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_SERVICE_ACCOUNT_JSON
            ? (await getFirestoreWeatherConfig()) ?? getWeatherConfig()
            : getWeatherConfig();
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
        const saved = process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_SERVICE_ACCOUNT_JSON
            ? await saveFirestoreWeatherConfig(next)
            : saveWeatherConfig(next);
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
