'use client';

import { useEffect, useState } from 'react';
import { apiUrl } from '@/lib/api';
import { auth } from '@/lib/firebase';

type Warning = { id: string; title: string; description: string; priority: string; status: 'draft' | 'published' | 'resolved'; visible: boolean; startsAt: string; endsAt: string | null; area: { type: 'Polygon'; coordinates: number[][][] } };

export default function WarningAdminPanel() {
    const [warnings, setWarnings] = useState<Warning[]>([]);
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('normal');
    const [warningStatus, setWarningStatus] = useState<'draft' | 'published' | 'resolved'>('draft');
    const [visible, setVisible] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);

    const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
        const token = await auth.currentUser?.getIdToken();
        return fetch(url, { ...options, headers: { ...(options.headers ?? {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
    };
    const load = () => authenticatedFetch(apiUrl('/api/v1/admin/warnings')).then((response) => response.json()).then((body) => {
        if (body.error) throw new Error(body.error);
        setWarnings(body.warnings ?? []);
    }).catch((error) => setMessage(error instanceof Error ? error.message : 'Laden fehlgeschlagen'));

    useEffect(() => { load(); }, []);

    const create = async (event: React.FormEvent) => {
        event.preventDefault();
        const now = new Date().toISOString();
        const response = await authenticatedFetch(apiUrl(editingId ? `/api/v1/admin/warnings/${editingId}` : '/api/v1/admin/warnings'), {
            method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, priority, status: warningStatus, visible, startsAt: now, endsAt: null, area: { type: 'Polygon', coordinates: [[[10, 50], [10, 51], [11, 51], [10, 50]]] } }),
        });
        const body = await response.json();
        setMessage(response.ok ? (editingId ? 'Warnung aktualisiert.' : 'Entwurf gespeichert.') : body.error ?? 'Speichern fehlgeschlagen');
        if (response.ok) { setTitle(''); setDescription(''); setPriority('normal'); setWarningStatus('draft'); setVisible(true); setEditingId(null); load(); }
    };

    const publish = async (id: string) => {
        const response = await authenticatedFetch(apiUrl(`/api/v1/admin/warnings/${id}/publish`), { method: 'POST' });
        const body = await response.json();
        setMessage(response.ok ? 'Warnung veröffentlicht.' : body.error ?? 'Veröffentlichung fehlgeschlagen');
        if (response.ok) load();
    };

    const toggleVisibility = async (warning: Warning) => {
        const response = await authenticatedFetch(apiUrl(`/api/v1/admin/warnings/${warning.id}`), { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...warning, visible: !warning.visible }) });
        const body = await response.json();
        setMessage(response.ok ? (warning.visible ? 'Warnung im Client ausgeblendet.' : 'Warnung im Client eingeblendet.') : body.error ?? 'Sichtbarkeit konnte nicht geändert werden.');
        if (response.ok) load();
    };

    return <div className="space-y-4">
        {message ? <p role="status" className="rounded-xl border p-3 text-sm">{message}</p> : null}
        <form onSubmit={create} className="space-y-3 rounded-2xl border bg-white p-5 shadow-sm">
            <input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Titel" className="w-full rounded-lg border p-2" />
            <textarea required value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Beschreibung und Handlungshinweis" className="min-h-24 w-full rounded-lg border p-2" />
            <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">Priorität<select value={priority} onChange={(event) => setPriority(event.target.value)} className="mt-1 w-full rounded-lg border p-2"><option value="low">Niedrig</option><option value="normal">Normal</option><option value="middle">Mittel</option><option value="high">Hoch</option><option value="critical">Kritisch</option></select></label>
                <label className="text-sm">Status<select value={warningStatus} onChange={(event) => setWarningStatus(event.target.value as typeof warningStatus)} className="mt-1 w-full rounded-lg border p-2"><option value="draft">Entwurf</option><option value="published">Veröffentlicht</option><option value="resolved">Erledigt</option></select></label>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={visible} onChange={(event) => setVisible(event.target.checked)} /> Im öffentlichen Client anzeigen</label>
            <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Entwurf speichern</button>
        </form>
        {warnings.map((warning) => <article key={warning.id} className="flex items-center justify-between gap-3 rounded-2xl border bg-white p-4 shadow-sm"><div><strong>{warning.title}</strong><p className="text-sm text-slate-600">{warning.priority} · {warning.status} · Deutschland</p><p className="text-sm">{warning.description}</p><span className="text-xs text-slate-500">{warning.visible ? 'Im Client sichtbar' : 'Im Client ausgeblendet'}</span></div><div className="flex flex-wrap justify-end gap-2">{warning.status === 'draft' ? <button onClick={() => publish(warning.id)} className="rounded-lg bg-amber-500 px-3 py-2 text-sm text-white">Veröffentlichen</button> : null}<button onClick={() => toggleVisibility(warning)} className="rounded-lg border px-3 py-2 text-sm">{warning.visible ? 'Ausblenden' : 'Einblenden'}</button><button onClick={() => { setEditingId(warning.id); setTitle(warning.title); setDescription(warning.description); setPriority(warning.priority); setWarningStatus(warning.status); setVisible(warning.visible); }} className="rounded-lg border px-3 py-2 text-sm">Bearbeiten</button></div></article>)}
    </div>;
}
