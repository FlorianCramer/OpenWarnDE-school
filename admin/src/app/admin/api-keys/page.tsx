'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/ui/header';
import { apiUrl } from '@/lib/api';
import { auth } from '@/lib/firebase';

type ApiKey = { id: string; label: string; prefix: string; unlimited: true; active: boolean; createdAt: string };

export default function ApiKeysPage() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [label, setLabel] = useState('');
    const [newKey, setNewKey] = useState('');
    const [message, setMessage] = useState('');

    const request = async (url: string, options: RequestInit = {}) => {
        const token = await auth.currentUser?.getIdToken();
        return fetch(url, { ...options, headers: { ...(options.headers ?? {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
    };
    const load = async () => { const response = await request(apiUrl('/api/v1/admin/api-keys')); const body = await response.json(); if (!response.ok) throw new Error(body.error); setKeys(body.keys ?? []); };
    useEffect(() => {
        const timer = window.setTimeout(() => {
            void load().catch((error) => setMessage(error.message));
        }, 0);
        return () => window.clearTimeout(timer);
    }, []);

    const create = async (event: React.FormEvent) => {
        event.preventDefault(); const response = await request(apiUrl('/api/v1/admin/api-keys'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ label }) }); const body = await response.json();
        if (!response.ok) { setMessage(body.error ?? 'Key konnte nicht erstellt werden.'); return; }
        setNewKey(body.key); setLabel(''); setMessage('API-Key erstellt. Kopiere ihn jetzt; er wird später nicht erneut angezeigt.'); await load();
    };
    const revoke = async (id: string) => { if (!window.confirm('API-Key wirklich deaktivieren?')) return; const response = await request(apiUrl(`/api/v1/admin/api-keys?id=${encodeURIComponent(id)}`), { method: 'DELETE' }); if (response.ok) await load(); };

    return <section className="space-y-6"><Header headline="API-Keys" subline="Erstelle verwaltete API-Zugänge ohne projektseitiges Anfrage-Limit." />
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"><h2 className="font-semibold">Neuen Unlimited-Key vergeben</h2><p className="mt-1 text-sm text-[var(--muted-foreground)]">Der Schlüssel wird gehasht gespeichert und nur einmal vollständig angezeigt. Die Berechtigung ersetzt keine Admin-Rechte.</p><form onSubmit={create} className="mt-4 flex flex-col gap-3 sm:flex-row"><input required maxLength={80} value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Bezeichnung, z. B. Wetterdienst" className="min-h-11 flex-1 rounded-lg border px-3" /><button className="min-h-11 rounded-lg bg-[var(--primary)] px-4 font-semibold text-white">Key erstellen</button></form>{newKey && <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4"><p className="text-sm font-medium text-amber-900">Einmalig kopieren:</p><code className="mt-2 block break-all text-sm text-amber-950">{newKey}</code></div>}{message && <p role="status" className="mt-3 text-sm">{message}</p>}</div>
        <div className="space-y-3">{keys.length === 0 ? <p className="rounded-xl border border-dashed p-6 text-sm text-[var(--muted-foreground)]">Noch keine API-Keys vorhanden.</p> : keys.map((key) => <article key={key.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"><div><p className="font-medium">{key.label}</p><p className="font-mono text-xs text-[var(--muted-foreground)]">{key.prefix}… · {key.unlimited ? 'unbegrenzt' : 'limitiert'} · {key.active ? 'aktiv' : 'deaktiviert'}</p></div>{key.active && <button onClick={() => void revoke(key.id)} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700">Deaktivieren</button>}</article>)}</div>
    </section>;
}
