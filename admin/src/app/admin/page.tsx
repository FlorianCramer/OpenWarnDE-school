'use client';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { Header } from '@/components/ui/header';
import { CardRow, type CardContent } from '@/components/ui/card';

export default function AdminPage() {
    const [displayName, setDisplayName] = useState('undefined');

    useEffect(
        () =>
            onAuthStateChanged(auth, async (user) => {
                if (!user) return;
                const profile = await getDoc(doc(db, 'user', user.uid));
                const data = profile.data() as { display_name?: string } | undefined;
                setDisplayName(data?.display_name?.trim() || user.displayName || 'undefined');
            }),
        [],
    );

    const row1: CardContent[] = [
        {
            header: true,
            headline: 'Aktive Warnungen',
            contenttype: 'number',
            content: '0',
        },
        {
            header: true,
            headline: 'Karten-Layer',
            contenttype: 'number',
            content: '2',
        },
        {
            header: true,
            headline: 'Status',
            contenttype: 'status',
            statustype: 'success',
            content: 'very good',
        },
    ];

    return (
        <div>
            <p className="text-sm font-semibold tracking-wide uppercase text-[var(--primary)] mb-1">
                Willkommen zurück, {displayName}
            </p>

            <Header
                headline="Übersicht"
                subline="Verwalte Warnmeldungen und Karten-Layer zentral über das OpenWarnDE 2.0 Backend."
            />

            <CardRow cards={row1} />
        </div>
    );
}
