import type { NormalizedWarning } from './normalize';
import { normalizeWarning } from './normalize';

export async function fetchConfiguredWarnings(): Promise<NormalizedWarning[]> {
    const url = process.env.WARNINGS_SOURCE_URL?.trim();
    if (!url) return [];
    try {
        const response = await fetch(url, {
            signal: AbortSignal.timeout(8000),
            headers: { Accept: 'application/json' },
            cache: 'no-store',
        });
        if (!response.ok) return [];
        const body = (await response.json()) as unknown;
        const entries = Array.isArray(body)
            ? body
            : body &&
                typeof body === 'object' &&
                Array.isArray((body as { warnings?: unknown[] }).warnings)
              ? (body as { warnings: unknown[] }).warnings
              : [];
        return entries
            .filter((entry): entry is Record<string, unknown> =>
                Boolean(entry && typeof entry === 'object'),
            )
            .map((entry, index) =>
                normalizeWarning(
                    entry,
                    process.env.WARNINGS_SOURCE_NAME ?? 'Konfigurierte Quelle',
                    index,
                ),
            )
            .filter((warning) => warning.status === 'active');
    } catch {
        return [];
    }
}
