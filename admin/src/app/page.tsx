import type { Metadata } from 'next';
import LoginForm from '@/components/auth/login-form';

export const metadata: Metadata = {
    title: 'Startseite',
};

export default function HomePage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 py-12 text-[var(--foreground)]">
            <section className="w-full max-w-xl rounded-2xl border border-[var(--border)] bg-(--card) p-8 text-center shadow-md">
                <h1 className="text-3xl font-bold tracking-tight">Verwaltungsoberfläche</h1>
                <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                    Öffne den geschützten Verwaltungsbereich, um Dashboard, Layer und Warnungen zu
                    verwalten.
                </p>
                <LoginForm />
            </section>
        </main>
    );
}
