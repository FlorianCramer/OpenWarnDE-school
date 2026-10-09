'use client';

import { useEffect, useState } from 'react';

function formatUptime(milliseconds: number) {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const days = Math.floor(totalSeconds / 86_400);
    const hours = Math.floor((totalSeconds % 86_400) / 3_600);
    const minutes = Math.floor((totalSeconds % 3_600) / 60);
    const seconds = totalSeconds % 60;

    return `${days} Tag(e), ${hours} Std., ${minutes} Min., ${seconds} Sek.`;
}

export default function RuntimeValue({ initialMilliseconds }: { initialMilliseconds: number }) {
    const [milliseconds, setMilliseconds] = useState(initialMilliseconds);

    useEffect(() => {
        const startedAt = Date.now() - initialMilliseconds;
        const update = () => setMilliseconds(Date.now() - startedAt);
        const timer = window.setInterval(update, 1000);
        update();

        return () => window.clearInterval(timer);
    }, [initialMilliseconds]);

    return <>{formatUptime(milliseconds)}</>;
}

export function StartedAtValue({ initialMilliseconds }: { initialMilliseconds: number }) {
    const [value, setValue] = useState<string | null>(null);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setValue(
                new Date(Date.now() - initialMilliseconds).toLocaleString('de-DE', {
                    timeZone: 'Europe/Berlin',
                }),
            );
        }, 0);
        return () => window.clearTimeout(timer);
    }, [initialMilliseconds]);

    return <>{value ?? 'Wird berechnet …'}</>;
}
