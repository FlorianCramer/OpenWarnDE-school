export default function ServerPage() {
    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-b from-neutral-50 via-white to-neutral-100 px-6 py-16 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
            {/* Background Deko */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
                <div className="absolute bottom-0 right-0 h-100 w-100 translate-x-1/3 translate-y-1/3 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-500/10" />
            </div>

            <div className="w-full max-w-3xl">
                {/* Badge */}
                <div className="mb-6 flex justify-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-3 py-1 text-xs font-medium text-neutral-600 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-400">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        Server aktiv
                    </span>
                </div>

                {/* Header */}
                <header className="space-y-4 text-center">
                    <h1 className="bg-linear-to-br from-neutral-900 to-neutral-600 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl dark:from-white dark:to-neutral-400">
                        OpenWarnDE Server
                    </h1>
                    <p className="mx-auto max-w-xl text-balance text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                        Hier werden Wetterquellen verwaltet. Der Client nutzt OpenStreetMap und legt
                        den vom Server berechneten Regen-Konsens als einzigen Wetterlayer darüber.
                    </p>
                </header>

                {/* Actions */}
                <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                    <a
                        href="/admin"
                        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-neutral-900/10 transition-all hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-xl hover:shadow-neutral-900/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950"
                    >
                        Wetterquellen verwalten
                        <svg
                            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>
                    <a
                        href="/api/v1/weather"
                        className="group inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white/70 px-5 py-3 text-sm font-medium text-neutral-800 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-200 dark:hover:border-neutral-700 dark:hover:bg-neutral-900 dark:focus-visible:ring-neutral-600 dark:focus-visible:ring-offset-neutral-950"
                    >
                        <svg
                            className="h-4 w-4 text-neutral-500 transition-colors group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-200"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        <code className="font-mono text-xs">/api/v1/weather</code>
                    </a>
                </div>
            </div>
        </main>
    );
}
