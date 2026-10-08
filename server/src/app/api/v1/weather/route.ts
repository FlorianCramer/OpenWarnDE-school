import { errorResponse, json } from '@/lib/http';
import { publicWeather } from '@/lib/weather/public';
import { getWeatherConfig } from '@/lib/weather/store';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export function GET(request: Request) {
    try {
        return json({ weather: publicWeather(getWeatherConfig(), new URL(request.url).origin) });
    } catch (error) {
        return errorResponse(error);
    }
}
