import { errorResponse, json } from '@/lib/http';
import { getWeatherConfig, saveWeatherConfig } from '@/lib/weather/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function OPTIONS(request: Request) {
    return json(null, 204, request);
}

export function GET(request: Request) {
    try {
        return json(getWeatherConfig(), 200, request);
    } catch (error) {
        return errorResponse(error, request);
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        return json(saveWeatherConfig(body), 200, request);
    } catch (error) {
        return errorResponse(error, request);
    }
}
