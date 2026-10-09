import RuntimeValue, { StartedAtValue } from './runtime-value';

export const dynamic = 'force-dynamic';

export default function ApiStatusPage() {
    const uptimeMilliseconds = process.uptime() * 1000;

    return (
        <main
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1.5rem',
                fontFamily:
                    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
                background: '#fafafa',
                color: '#0a0a0a',
                WebkitFontSmoothing: 'antialiased',
            }}
        >
            <section style={{ width: '100%', maxWidth: '28rem' }}>
                {/* Status indicator */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '3rem',
                    }}
                >
                    <span
                        style={{
                            position: 'relative',
                            display: 'inline-flex',
                            width: '0.5rem',
                            height: '0.5rem',
                        }}
                    >
                        <span
                            style={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '50%',
                                background: '#3b82f6',
                                opacity: 0.4,
                                animation: 'ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite',
                            }}
                        />
                        <span
                            style={{
                                position: 'relative',
                                width: '0.5rem',
                                height: '0.5rem',
                                borderRadius: '50%',
                                background: '#3b82f6',
                            }}
                        />
                    </span>
                    <span
                        style={{
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: '#737373',
                        }}
                    >
                        System operational
                    </span>
                </div>

                {/* Headline */}
                <h1
                    style={{
                        fontSize: '2.25rem',
                        lineHeight: 1.1,
                        fontWeight: 600,
                        letterSpacing: '-0.03em',
                        margin: 0,
                        color: '#0a0a0a',
                    }}
                >
                    OPENWARNDE
                    <span style={{ color: '#3b82f6' }}>.</span>
                </h1>

                <p
                    style={{
                        marginTop: '0.75rem',
                        marginBottom: '3rem',
                        fontSize: '0.9375rem',
                        lineHeight: 1.6,
                        color: '#737373',
                    }}
                >
                    API-Server erreichbar auf Port{' '}
                    <span style={{ color: '#0a0a0a', fontWeight: 500 }}>8080</span>.
                </p>

                {/* Data list */}
                <dl
                    style={{
                        margin: 0,
                        borderTop: '1px solid #e5e5e5',
                    }}
                >
                    <Row label="Status">
                        <span style={{ color: '#3b82f6', fontWeight: 500 }}>
                            Aktiv
                        </span>
                    </Row>
                    <Row label="Gestartet">
                        <StartedAtValue initialMilliseconds={uptimeMilliseconds} />
                    </Row>
                    <Row label="Laufzeit">
                        <RuntimeValue initialMilliseconds={uptimeMilliseconds} />
                    </Row>
                    <Row label="Endpoint" last>
                        <span
                            style={{
                                fontFamily:
                                    'ui-monospace, SFMono-Regular, Menlo, monospace',
                                fontSize: '0.8125rem',
                                color: '#0a0a0a',
                            }}
                        >
                            /api/v1/
                        </span>
                    </Row>
                </dl>
            </section>

            <style>{`
                @keyframes ping {
                    75%, 100% {
                        transform: scale(2.5);
                        opacity: 0;
                    }
                }
            `}</style>
        </main>
    );
}

function Row({
    label,
    children,
    last = false,
}: {
    label: string;
    children: React.ReactNode;
    last?: boolean;
}) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '1rem',
                padding: '1rem 0',
                borderBottom: last ? 'none' : '1px solid #e5e5e5',
            }}
        >
            <dt
                style={{
                    fontSize: '0.8125rem',
                    fontWeight: 400,
                    color: '#a3a3a3',
                    margin: 0,
                }}
            >
                {label}
            </dt>
            <dd
                style={{
                    margin: 0,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0a0a0a',
                    textAlign: 'right',
                }}
            >
                {children}
            </dd>
        </div>
    );
}