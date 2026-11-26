import { corsHeaders } from '@/lib/http';

export const runtime = 'nodejs';

const document = {
    openapi: '3.0.3',
    info: {
        title: 'OpenWarnDE API',
        version: '1.0.0',
        description: 'Öffentliche Warn-, Wetter- und Suchschnittstelle.',
    },
    servers: [{ url: 'http://localhost:8080' }],
    security: [{ ApiKeyAuth: [] }],
    components: {
        securitySchemes: { ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'X-API-Key' } },
    },
    paths: {
        '/api/v1/warnings': { get: { summary: 'Aktive normalisierte Warnungen' } },
        '/api/v1/weather': { get: { summary: 'Wetter-Layer und Tile-Metadaten' } },
        '/api/v1/weather/radar/tiles/{z}/{x}/{y}.png': {
            get: { summary: 'Normalisierte Wetterkachel' },
        },
        '/api/v1/location/search': {
            get: {
                summary: 'Ortssuche',
                parameters: [
                    { name: 'q', in: 'query', required: true, schema: { type: 'string' } },
                ],
            },
        },
        '/api/admin/config': {
            get: { summary: 'Wetterquellen-Konfiguration' },
            put: { summary: 'Wetterquellen speichern' },
        },
    },
};

export function GET(request: Request) {
    return Response.json(document, {
        headers: { ...corsHeaders(request), 'Cache-Control': 'public, max-age=300' },
    });
}
