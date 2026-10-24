'use client';

import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updateEmail,
    updatePassword,
    updateProfile,
} from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { FormEvent, useMemo, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/input';

type Props = { uid: string; email: string; displayName: string; role: string; active: boolean };

export default function AccountFormEditor({ uid, email, displayName, role, active }: Props) {
    const [name, setName] = useState(displayName);
    const [newEmail, setNewEmail] = useState(email);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const dirty = useMemo(
        () => name !== displayName || newEmail !== email || Boolean(newPassword),
        [name, displayName, newEmail, email, newPassword],
    );

    async function save(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setMessage('');
        const trimmedName = name.trim();
        if (!trimmedName) return setError('Bitte einen Anzeigenamen eingeben.');
        if (newPassword && newPassword !== confirmPassword)
            return setError('Die neuen Passwörter stimmen nicht überein.');
        if ((newEmail !== email || newPassword) && !currentPassword)
            return setError(
                'Für E-Mail- oder Passwortänderungen ist dein aktuelles Passwort erforderlich.',
            );
        const firebaseUser = auth.currentUser;
        if (!firebaseUser)
            return setError('Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.');
        setSaving(true);
        try {
            if (newEmail !== email || newPassword) {
                await reauthenticateWithCredential(
                    firebaseUser,
                    EmailAuthProvider.credential(email, currentPassword),
                );
            }
            if (trimmedName !== displayName)
                await updateProfile(firebaseUser, { displayName: trimmedName });
            if (newEmail !== email) await updateEmail(firebaseUser, newEmail.trim());
            if (newPassword) await updatePassword(firebaseUser, newPassword);
            await updateDoc(doc(db, 'user', uid), {
                display_name: trimmedName,
                email: newEmail.trim(),
            });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setMessage('Änderungen wurden gespeichert.');
        } catch {
            setError(
                'Speichern fehlgeschlagen. Prüfe dein aktuelles Passwort und die Firestore-Regeln.',
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={save} className="space-y-7">
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Persönliche Daten</h2>
                <InputField
                    id="display_name"
                    label="Anzeigename"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <InputField
                    id="email"
                    label="E-Mail-Adresse"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                />
            </div>
            <div className="space-y-4 border-t border-[var(--border)] pt-6">
                <h2 className="text-lg font-semibold">Passwort ändern</h2>
                <InputField
                    id="current_password"
                    label="Aktuelles Passwort"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    hint="Nur erforderlich, wenn du E-Mail oder Passwort änderst."
                />
                <InputField
                    id="new_password"
                    label="Neues Passwort"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <InputField
                    id="confirm_password"
                    label="Neues Passwort wiederholen"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            <div className="grid gap-4 border-t border-[var(--border)] pt-6 sm:grid-cols-2">
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
            {message && (
                <p role="status" className="text-sm text-[var(--success)]">
                    {message}
                </p>
            )}
            {dirty && (
                <Button type="submit" disabled={saving}>
                    {saving ? 'Speichern …' : 'Änderungen speichern'}
                </Button>
            )}
        </form>
    );
}
