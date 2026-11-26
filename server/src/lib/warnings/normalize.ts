export type NormalizedWarning = {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'active' | 'expired';
    area: string;
    startsAt: string | null;
    endsAt: string | null;
    source: string;
};

const priority = (value: unknown): NormalizedWarning['priority'] => {
    const text = String(value ?? '').toLowerCase();
    if (text.includes('extrem') || text.includes('critical')) return 'critical';
    if (text.includes('hoch') || text.includes('severe')) return 'high';
    if (text.includes('mittel') || text.includes('moderate')) return 'medium';
    return 'low';
};

export const normalizeWarning = (
    raw: Record<string, unknown>,
    source: string,
    index: number,
): NormalizedWarning => {
    const end = raw.endsAt ?? raw.end ?? raw.expires;
    return {
        id: String(raw.id ?? raw.identifier ?? `${source}-${index}`),
        title: String(raw.title ?? raw.headline ?? raw.event ?? 'Warnung'),
        description: String(raw.description ?? raw.text ?? raw.instruction ?? ''),
        priority: priority(raw.priority ?? raw.severity),
        status: end && new Date(String(end)).getTime() < Date.now() ? 'expired' : 'active',
        area: String(raw.area ?? raw.region ?? raw.areaDesc ?? 'Unbekanntes Gebiet'),
        startsAt: raw.startsAt || raw.start ? String(raw.startsAt ?? raw.start) : null,
        endsAt: end ? String(end) : null,
        source,
    };
};
