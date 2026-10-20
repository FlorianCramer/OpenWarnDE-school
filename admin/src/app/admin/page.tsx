export default function AdminPage() {
    return (
        <div>
            <p className="text-sm font-semibold tracking-wide uppercase text-[var(--primary)]">
                Willkommen zurück
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--foreground)]">
                Übersicht
            </h1>

            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Verwalte Warnmeldungen und Karten-Layer zentral über das OpenWarnDE 2.0 Backend.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-xl border border-[var(--border)] bg-(--card) p-6 shadow-sm transition-shadow hover:shadow-md">
                    <p className="text-sm font-medium text-[var(--muted-foreground)]">
                        Aktive Warnungen
                    </p>
                    <p className="mt-3 text-3xl font-bold text-[var(--foreground)]">0</p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-(--card) p-6 shadow-sm transition-shadow hover:shadow-md">
                    <p className="text-sm font-medium text-[var(--muted-foreground)]">
                        Karten-Layer
                    </p>
                    <p className="mt-3 text-3xl font-bold text-[var(--foreground)]">0</p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-(--card) p-6 shadow-sm transition-shadow hover:shadow-md">
                    <p className="text-sm font-medium text-[var(--muted-foreground)]">
                        Systemstatus
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                        <span
                            className="h-2.5 w-2.5 rounded-full bg-[var(--success)]"
                            aria-hidden="true"
                        />
                        <p className="text-lg font-semibold text-[var(--success)]">Bereit</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
