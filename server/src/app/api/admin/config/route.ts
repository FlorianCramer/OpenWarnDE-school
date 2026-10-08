import { errorResponse, json } from '@/lib/http';
import { getWeatherConfig, saveWeatherConfig } from '@/lib/weather/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
    try {
        return json(getWeatherConfig());
    } catch (error) {
        return errorResponse(error);
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        return json(saveWeatherConfig(body));
    } catch (error) {
        return errorResponse(error);
    }
}
