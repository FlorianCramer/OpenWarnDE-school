import { NextResponse } from 'next/server';
import { composeWeatherTile } from '@/lib/weather/compose';
import { errorResponse } from '@/lib/http';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
function coordinate(value: string, max: number) {
    if (!/^\d+$/.test(value)) return null;
    const number = Number(value);
    return number <= max ? number : null;
}
export async function GET(
    _request: Request,
    context: { params: Promise<{ z: string; x: string; y: string }> },
) {
    try {
        const { z: rawZ, x: rawX, y: rawY } = await context.params;
        const z = coordinate(rawZ, 20);
        const max = z === null ? 0 : 2 ** z - 1;
        const x = z === null ? null : coordinate(rawX, max);
        const y = z === null ? null : coordinate(rawY, max);
        if (z === null || x === null || y === null)
            return NextResponse.json({ error: 'Ungültige Wetterkachel' }, { status: 400 });
        const png = await composeWeatherTile(z, x, y);
        return new NextResponse(new Uint8Array(png), {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=120',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        return errorResponse(error);
    }
}
