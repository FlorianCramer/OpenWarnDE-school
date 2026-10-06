export default function ServerPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/5 via-background to-background">
            <div className="max-w-2xl w-full text-center space-y-8">
                <header className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                        OpenWarnDE Server
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
                        Backend API for the OpenWarnDE warning system. Built with Next.js 16, React
                        19, and Tailwind CSS v4.
                    </p>
                </header>

                <div className="grid gap-4 md:grid-cols-2">
                    <section className="rounded-xl border border-border bg-card p-6 text-left transition-shadow hover:shadow-lg">
                        <h2 className="text-xl font-semibold mb-2">API Endpoints</h2>
                        <p className="text-muted-foreground text-sm">
                            RESTful endpoints for warnings, locations, and metadata. Ready for
                            integration with the client application.
                        </p>
                    </section>
                    <section className="rounded-xl border border-border bg-card p-6 text-left transition-shadow hover:shadow-lg">
                        <h2 className="text-xl font-semibold mb-2">Development</h2>
                        <p className="text-muted-foreground text-sm">
                            Running on port 3001 with hot reload. Check the terminal for API logs
                            and requests.
                        </p>
                    </section>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                    <a
                        href="http://localhost:3000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Open Client (Port 3000)
                    </a>
                </div>

                <footer className="text-xs text-muted-foreground">
                    <p>
                        OpenWarnDE-school monorepo • Start with{' '}
                        <code className="px-1.5 py-0.5 rounded bg-muted font-mono">
                            npm run dev
                        </code>
                    </p>
                </footer>
            </div>
        </main>
    );
}
