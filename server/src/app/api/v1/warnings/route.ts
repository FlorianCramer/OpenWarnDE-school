import { errorResponse, json } from '@/lib/http';
import { fetchConfiguredWarnings } from '@/lib/warnings/source';
import { listWarnings } from '@/lib/warnings/store';
import { listFirestoreWarnings } from '@/lib/warnings/firestore-store';
import { hasServerFirebase } from '@/lib/firebase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const storedWarnings = hasServerFirebase
            ? await listFirestoreWarnings(true)
            : listWarnings(true);
        const warnings = [...storedWarnings, ...(await fetchConfiguredWarnings())];
        return json({ warnings, updatedAt: new Date().toISOString() }, 200, request);
    } catch (error) {
        return errorResponse(error, request);
    }
}
