import { errorResponse, json } from '@/lib/http';
import { fetchConfiguredWarnings } from '@/lib/warnings/source';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const warnings = await fetchConfiguredWarnings();
        return json({ warnings, updatedAt: new Date().toISOString() }, 200, request);
    } catch (error) {
        return errorResponse(error, request);
    }
}
