import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

const defaultOrigins = [
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://localhost:3000',
    'http://localhost:3001',
];

function allowedOrigin(request?: Request) {
    const configured = (process.env.CORS_ORIGINS ?? defaultOrigins.join(','))
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
    const requestOrigin = request?.headers.get('origin');
    return requestOrigin && configured.includes(requestOrigin)
        ? requestOrigin
        : (configured[0] ?? defaultOrigins[0]);
}

export function json(body: unknown, status = 200, request?: Request) {
    return NextResponse.json(body, {
        status,
        headers: {
            'Access-Control-Allow-Origin': allowedOrigin(request),
            'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            Vary: 'Origin',
            'Cache-Control': 'no-store',
        },
    });
}

export function errorResponse(error: unknown, request?: Request) {
    if (error instanceof ZodError) {
        return json({ error: 'Ungültige Konfiguration', issues: error.issues }, 400, request);
    }
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
    return json({ error: message }, 500, request);
}
