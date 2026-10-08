import { NextResponse } from 'next/server';
/* Legacy endpoint intentionally returns 410; the public API is weather-only. */
/* eslint-disable @typescript-eslint/no-unused-vars */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface TileParams {
    layerId: string;
    z: string;
    x: string;
    y: string;
}

function parseCoord(value: string, max: number) {
    if (!/^\d+$/.test(value)) return null;
    const parsed = Number(value);
    if (parsed > max) return null;
    return parsed;
}

export async function GET() {
    return NextResponse.json(
        { error: 'Diese API stellt nur noch den Wetterlayer bereit.' },
        { status: 410 },
    );
    /*
    try {
        const params = await context.params;
        const z = parseCoord(params.z, 20);
        const zoomMax = z === null ? 0 : 2 ** z;
        const x = z === null ? null : parseCoord(params.x, zoomMax - 1);
        const y = z === null ? null : parseCoord(params.y, zoomMax - 1);
        if (z === null || x === null || y === null) {
            return NextResponse.json({ error: 'Ungültige Kachel' }, { status: 400 });
        }

        const png = await composeLayerTile(params.layerId, z, x, y);
        if (!png) {
            return NextResponse.json({ error: 'Layer nicht gefunden' }, { status: 404 });
        }

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
    */
}
