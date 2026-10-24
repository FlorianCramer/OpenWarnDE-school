'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { Header } from '@/components/ui/header';
import AccountForm from '@/components/account/account-form-editor';

export default function AccountPage() {
    const [user, setUser] = useState<{
        uid: string;
        displayName?: string;
        email?: string;
        role?: string;
        active?: boolean;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;

        onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setLoading(false);
                router.replace('/');
                return;
            }

            try {
                const profileDoc = await getDoc(doc(db, 'user', firebaseUser.uid));

                if (!profileDoc.exists()) {
                    setError('Benutzerprofil nicht gefunden.');
                    setLoading(false);
                    return;
                }

                const data = profileDoc.data() as {
                    display_name?: string;
                    email?: string;
                    role?: string;
                    active?: boolean;
                };

                if (!cancelled) {
                    setUser({
                        uid: firebaseUser.uid,
                        displayName: data.display_name,
                        email: data.email,
                        role: data.role,
                        active: data.active,
                    });
                    setLoading(false);
                }
            } catch {
                if (!cancelled) {
                    setError('Benutzerprofil konnte nicht geladen werden.');
                    setLoading(false);
                }
            }
        });

        return () => {
            cancelled = true;
        };
    }, [router]);

    if (loading) {
        return (
            <section className="min-h-screen flex items-center justify-center p-6">
                <p className="text-sm text-[var(--muted-foreground)]">Lade Profilinformationen …</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="min-h-screen flex items-center justify-center p-6">
                <p className="text-red-600 text-sm">{error}</p>
                <button
                    onClick={() => router.replace('/admin')}
                    className="mt-4 inline-block rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                    Zurück zur Übersicht
                </button>
            </section>
        );
    }

    if (!user) {
        return (
            <section className="min-h-screen flex items-center justify-center p-6">
                <p className="text-[var(--muted-foreground)]">Keine Benutzerdaten verfügbar.</p>
            </section>
        );
    }

    return (
        <section className="py-12">
            <Header
                headline="Mein Account"
                subline="Hier erscheinen alle Details zu deinem Account"
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
                    <AccountForm
                        uid={user.uid}
                        email={user.email || ''}
                        displayName={user.displayName || ''}
                        role={user.role || ''}
                        active={user.active === true}
                    />
                </div>
                <div aria-hidden="true" />
                <div aria-hidden="true" />
            </div>
        </section>
    );
}
