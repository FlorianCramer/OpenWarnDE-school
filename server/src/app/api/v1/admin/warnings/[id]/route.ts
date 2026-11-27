import { errorResponse, json } from '@/lib/http';
import { requireAdminAccess } from '@/lib/api/auth';
import { updateWarning } from '@/lib/warnings/store';
import { updateFirestoreWarning } from '@/lib/warnings/firestore-store';
import { warningInputSchema } from '@/lib/warnings/model';
import { hasServerFirebase } from '@/lib/firebase';

export const runtime = 'nodejs';

export function OPTIONS(request: Request) {
    return json(null, 204, request);
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        if (!(await requireAdminAccess(request))) return json({ error: 'Admin-Berechtigung erforderlich' }, 401, request);
        const { id } = await context.params;
        const input = warningInputSchema.parse(await request.json());
        const warning = hasServerFirebase ? await updateFirestoreWarning(id, input) : updateWarning(id, input);
        if (!warning) return json({ error: 'Warnung nicht gefunden' }, 404, request);
        return json({ warning }, 200, request);
    } catch (error) {
        return errorResponse(error, request);
    }
}
