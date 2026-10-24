'use client';

import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { FormEvent, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/input';

type AccountFormProps = {
    uid: string;
    email: string;
    displayName: string;
    role: string;
    active: boolean;
};

export default function AccountForm({ uid, email, displayName, role, active }: AccountFormProps) {
    const [name, setName] = useState(displayName);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');

    async function save(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName) {
            setError('Bitte einen Anzeigenamen eingeben.');
            return;
        }
        setSaving(true);
        setStatus('');
        setError('');
        try {
            await updateDoc(doc(db, 'user', uid), { display_name: trimmedName });
            if (auth.currentUser)
                await updateProfile(auth.currentUser, { displayName: trimmedName });
            setName(trimmedName);
            setStatus('Änderungen wurden gespeichert.');
        } catch {
            setError(
                'Die Änderungen konnten nicht gespeichert werden. Prüfe die Firestore-Regeln.',
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={save} className="space-y-6">
            <InputField
                id="display_name"
                label="Anzeigename"
                value={name}
                onChange={(e) => setName(e.target.value)}
                hint="Dieser Name wird in der Accountübersicht angezeigt."
            />
            <InputField
                id="email"
                label="E-Mail-Adresse"
                type="email"
                value={email}
                disabled
                hint="Die E-Mail-Adresse wird über Firebase Authentication verwaltet."
            />
            <div className="grid gap-4 sm:grid-cols-2">
                <InputField id="role" label="Rolle" value={role || 'Nicht gesetzt'} disabled />
                <InputField
                    id="active"
                    label="Status"
                    value={active ? 'Aktiv' : 'Inaktiv'}
                    disabled
                />
            </div>
            <p className="break-all rounded-xl bg-[var(--muted)] p-3 font-mono text-xs text-[var(--muted-foreground)]">
                UID: {uid}
            </p>
            {error && (
                <p role="alert" className="text-sm text-[var(--destructive)]">
                    {error}
                </p>
            )}
            {status && (
                <p role="status" className="text-sm text-[var(--success)]">
                    {status}
                </p>
            )}
            <Button type="submit" disabled={saving}>
                {saving ? 'Speichern …' : 'Änderungen speichern'}
            </Button>
        </form>
    );
}
