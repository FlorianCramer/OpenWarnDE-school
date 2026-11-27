import { errorResponse, json } from '@/lib/http';
import { requireAdminAccess } from '@/lib/api/auth';
import { createWarning, listWarnings } from '@/lib/warnings/store';
import { createFirestoreWarning, listFirestoreWarnings } from '@/lib/warnings/firestore-store';
import { warningInputSchema } from '@/lib/warnings/model';
import { hasServerFirebase } from '@/lib/firebase';

export const runtime = 'nodejs';

export function OPTIONS(request: Request) {
    return json(null, 204, request);
}

const shouldUseFirestore = () => hasServerFirebase;

export async function GET(request: Request) {
    if (!(await requireAdminAccess(request))) return json({ error: 'Admin-Berechtigung erforderlich' }, 401, request);
    return json({ warnings: shouldUseFirestore() ? await listFirestoreWarnings() : listWarnings() }, 200, request);
}

export async function POST(request: Request) {
    try {
        if (!(await requireAdminAccess(request))) return json({ error: 'Admin-Berechtigung erforderlich' }, 401, request);
        const input = warningInputSchema.parse(await request.json());
        const warning = shouldUseFirestore() ? await createFirestoreWarning(input) : createWarning(input);
        return json({ warning }, 201, request);
    } catch (error) {
        return errorResponse(error, request);
    }
}
