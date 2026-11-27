import { errorResponse, json } from '@/lib/http';
import { requireAdminAccess } from '@/lib/api/auth';
import { createApiKey, listApiKeys, revokeApiKey } from '@/lib/api/keys';

export const runtime = 'nodejs';

export function OPTIONS(request: Request) {
    return json(null, 204, request);
}

export async function GET(request: Request) {
    if (!(await requireAdminAccess(request))) return json({ error: 'Admin-Berechtigung erforderlich' }, 401, request);
    try {
        return json({ keys: await listApiKeys() }, 200, request);
    } catch (error) {
        return errorResponse(error, request);
    }
}

export async function POST(request: Request) {
    if (!(await requireAdminAccess(request))) return json({ error: 'Admin-Berechtigung erforderlich' }, 401, request);
    try {
        const body = (await request.json()) as { label?: string };
        const label = body.label?.trim();
        if (!label || label.length > 80) return json({ error: 'Ein gültiger Name ist erforderlich.' }, 400, request);
        return json(await createApiKey(label), 201, request);
    } catch (error) {
        return errorResponse(error, request);
    }
}

export async function DELETE(request: Request) {
    if (!(await requireAdminAccess(request))) return json({ error: 'Admin-Berechtigung erforderlich' }, 401, request);
    try {
        const id = new URL(request.url).searchParams.get('id');
        if (!id || !(await revokeApiKey(id))) return json({ error: 'API-Key nicht gefunden' }, 404, request);
        return json({ success: true }, 200, request);
    } catch (error) {
        return errorResponse(error, request);
    }
}
