'use client';

import { Header } from '@/components/ui/header';
import { useEffect, useState } from 'react';
import { apiUrl } from '@/lib/api';

export default function DashboardPage() {
    const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');
    useEffect(() => {
        fetch(apiUrl('/api/v1/weather'), { cache: 'no-store' })
            .then((response) => setStatus(response.ok ? 'online' : 'offline'))
            .catch(() => setStatus('offline'));
    }, []);
    return (
        <section>
            <Header
                headline="Dashboard"
                subline="Hier erscheinen detaillierte Kennzahlen und Systemmetriken der Plattform."
            />
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm">
                <span
                    className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${status === 'online' ? 'bg-[var(--success)]' : status === 'offline' ? 'bg-[var(--destructive)]' : 'bg-[var(--warning)]'}`}
                />
                API-Verbindung:{' '}
                {status === 'loading'
                    ? 'wird geprüft …'
                    : status === 'online'
                      ? 'verbunden'
                      : 'nicht erreichbar'}
            </div>
        </section>
    );
}
