import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function json(body: unknown, status = 200) {
    return NextResponse.json(body, {
        status,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store',
        },
    });
}

export function errorResponse(error: unknown) {
    if (error instanceof ZodError) {
        return json({ error: 'Ungültige Konfiguration', issues: error.issues }, 400);
    }
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
    return json({ error: message }, 500);
}
