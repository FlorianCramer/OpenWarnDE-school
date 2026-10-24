'use client';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { auth } from '@/lib/firebase';

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/admin');
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'code' in err) {
                const code = (err as { code: string }).code;
                if (
                    code === 'auth/invalid-credential' ||
                    code === 'auth/wrong-password' ||
                    code === 'auth/user-not-found'
                ) {
                    setError('E-Mail-Adresse oder Passwort ist falsch.');
                } else if (code === 'auth/too-many-requests') {
                    setError('Zu viele Fehlversuche. Bitte warte einen Moment.');
                } else {
                    setError('Ein unerwarteter Fehler ist aufgetreten.');
                }
            } else {
                setError('Ein unerwarteter Fehler ist aufgetreten.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
            <div className="space-y-2">
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[var(--foreground)] text-left"
                >
                    E-Mail-Adresse
                </label>
                <input
                    id="email"
                    required
                    type="email"
                    autoComplete="email"
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@beispiel.de"
                    className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none transition-all placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary)]/10 disabled:opacity-60 shadow-sm"
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-[var(--foreground)] text-left"
                    >
                        Passwort
                    </label>
                </div>
                <input
                    id="password"
                    required
                    type="password"
                    autoComplete="current-password"
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none transition-all placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary)]/10 disabled:opacity-60 shadow-sm"
                />
            </div>

            {error && (
                <div
                    role="alert"
                    aria-live="polite"
                    className="animate-in fade-in slide-in-from-top-1 rounded-xl bg-red-50 p-3.5 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-500/20"
                >
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading || !email || !password}
                className="group relative mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 font-semibold text-white shadow-md shadow-[var(--primary)]/20 transition-all hover:shadow-lg hover:shadow-[var(--primary)]/30 hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
            >
                {loading && (
                    <svg
                        className="h-4 w-4 animate-spin text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                )}
                {loading ? 'Anmeldung läuft …' : 'Anmelden'}
            </button>
        </form>
    );
}
