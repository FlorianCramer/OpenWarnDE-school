import { json } from '@/lib/http';
import { requireAdminAccess } from '@/lib/api/auth';
import { publishWarning } from '@/lib/warnings/store';
import { publishFirestoreWarning } from '@/lib/warnings/firestore-store';
import { sendWarningPush } from '@/lib/notifications/push';
import { hasServerFirebase } from '@/lib/firebase';

export const runtime = 'nodejs';

export function OPTIONS(request: Request) {
    return json(null, 204, request);
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
        if (!(await requireAdminAccess(request))) return json({ error: 'Admin-Berechtigung erforderlich' }, 401, request);
        const warning = hasServerFirebase ? await publishFirestoreWarning(id) : publishWarning(id);
        if (!warning) return json({ error: 'Warnung nicht gefunden' }, 404, request);
        const push = await sendWarningPush(warning.title, warning.description);
        return json({ warning, push }, 200, request);
}
