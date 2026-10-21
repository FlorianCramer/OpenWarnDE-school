'use client';

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';

export default function ProtectedAdmin({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [allowed, setAllowed] = useState(false);
    const [message, setMessage] = useState('Zugriff wird geprüft …');
    useEffect(
        () =>
            onAuthStateChanged(auth, async (user) => {
                if (!user) {
                    router.replace('/');
                    return;
                }
                try {
                    const profile = await getDoc(doc(db, 'user', user.uid));
                    const data = profile.data() as { role?: string; active?: boolean } | undefined;
                    if (
                        !profile.exists() ||
                        data?.active !== true ||
                        !['admin', 'dev'].includes(data.role ?? '')
                    ) {
                        setMessage(
                            'Dein Benutzerprofil fehlt, ist deaktiviert oder besitzt keine zulässige Rolle.',
                        );
                        await signOut(auth);
                        return;
                    }
                    setAllowed(true);
                } catch {
                    setMessage('Das Benutzerprofil konnte nicht geladen werden.');
                }
            }),
        [router],
    );
    if (!allowed)
        return (
            <main className="flex min-h-screen items-center justify-center p-6 text-center">
                {message}
            </main>
        );
    return <>{children}</>;
}
