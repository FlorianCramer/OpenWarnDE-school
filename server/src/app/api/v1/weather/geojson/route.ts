import { NextResponse } from 'next/server';
import { errorResponse } from '@/lib/http';
import { weatherGeoJson } from '@/lib/weather/geojson';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
    try {
        const search = new URL(request.url).searchParams;
        const values = search.get('bbox')?.split(',').map(Number);
        const zoom = Number(search.get('zoom') ?? 6);
        if (!values || values.length !== 4 || values.some((value) => !Number.isFinite(value)) || !Number.isFinite(zoom)) return NextResponse.json({ error: 'bbox muss minLon,minLat,maxLon,maxLat enthalten' }, { status: 400 });
        const [minLon, minLat, maxLon, maxLat] = values;
        if (minLon < -180 || maxLon > 180 || minLat < -85 || maxLat > 85 || minLon >= maxLon || minLat >= maxLat) return NextResponse.json({ error: 'Ungültige bbox' }, { status: 400 });
        return NextResponse.json(await weatherGeoJson(minLon, minLat, maxLon, maxLat, zoom), { headers: { 'Cache-Control': 'public, max-age=60', 'Access-Control-Allow-Origin': '*' } });
    } catch (error) { return errorResponse(error); }
}
