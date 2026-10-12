import RuntimeValue, { StartedAtValue } from './runtime-value';

export const dynamic = 'force-dynamic';

export default function ApiStatusPage() {
    const uptimeMilliseconds = process.uptime() * 1000;

    return (
        <main className="status-page">
            <div className="glow glow-top" />
            <div className="glow glow-bottom" />

            <section className="card">
                <header className="header">
                    <div className="status-badge">
                        <span className="ping-wrapper">
                            <span className="ping-ring" />
                            <span className="ping-dot" />
                        </span>
                        <span className="status-text">System operational</span>
                    </div>

                    <h1 className="title">
                        OPENWARNDE<span className="dot">.</span>
                    </h1>
                    <p className="subtitle">
                        API-Server erreichbar auf Port <span className="highlight">8080</span>.
                    </p>
                </header>

                <dl className="data-list">
                    <Row label="Status" icon="●">
                        <span className="value-active">Aktiv</span>
                    </Row>
                    <Row label="Gestartet" icon="◷">
                        <StartedAtValue initialMilliseconds={uptimeMilliseconds} />
                    </Row>
                    <Row label="Laufzeit" icon="⏱">
                        <RuntimeValue initialMilliseconds={uptimeMilliseconds} />
                    </Row>
                    <Row label="Endpoint" icon="⇢" last>
                        <code className="endpoint">/api/v1/</code>
                    </Row>
                </dl>

                <footer className="footer">
                    <span className="pulse-line" />
                    <span>Alle Systeme arbeiten normal</span>
                </footer>
            </section>

            <style>{`
                * { box-sizing: border-box; }

                .status-page {
                    position: relative;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem 1.5rem;
                    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
                    background: #fafafa;
                    color: #0a0a0a;
                    -webkit-font-smoothing: antialiased;
                    overflow: hidden;
                }

                .glow {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(120px);
                    opacity: 0.35;
                    pointer-events: none;
                    z-index: 0;
                }
                .glow-top {
                    top: -10%;
                    right: -10%;
                    width: 28rem;
                    height: 28rem;
                    background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
                }
                .glow-bottom {
                    bottom: -15%;
                    left: -10%;
                    width: 24rem;
                    height: 24rem;
                    background: radial-gradient(circle, #93c5fd 0%, transparent 70%);
                    opacity: 0.25;
                }

                .card {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    max-width: 30rem;
                    background: rgba(255, 255, 255, 0.75);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(229, 229, 229, 0.9);
                    border-radius: 1.25rem;
                    padding: 2.5rem 2.25rem 2rem;
                    box-shadow:
                        0 1px 2px rgba(0, 0, 0, 0.02),
                        0 12px 32px -8px rgba(0, 0, 0, 0.06),
                        0 32px 64px -16px rgba(59, 130, 246, 0.08);
                }

                .header { margin-bottom: 2.5rem; }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.35rem 0.75rem 0.35rem 0.6rem;
                    background: rgba(59, 130, 246, 0.07);
                    border: 1px solid rgba(59, 130, 246, 0.15);
                    border-radius: 999px;
                    margin-bottom: 1.75rem;
                }

                .ping-wrapper {
                    position: relative;
                    display: inline-flex;
                    width: 0.5rem;
                    height: 0.5rem;
                }
                .ping-ring {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    background: #3b82f6;
                    opacity: 0.5;
                    animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                .ping-dot {
                    position: relative;
                    width: 0.5rem;
                    height: 0.5rem;
                    border-radius: 50%;
                    background: #3b82f6;
                }

                .status-text {
                    font-size: 0.6875rem;
                    font-weight: 600;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: #2563eb;
                }

                .title {
                    font-size: 2.5rem;
                    line-height: 1.05;
                    font-weight: 700;
                    letter-spacing: -0.035em;
                    margin: 0;
                    color: #0a0a0a;
                }
                .dot { color: #3b82f6; }

                .subtitle {
                    margin: 0.75rem 0 0;
                    font-size: 0.9375rem;
                    line-height: 1.6;
                    color: #737373;
                }
                .highlight { color: #0a0a0a; font-weight: 600; }

                .data-list {
                    margin: 0;
                    border-top: 1px solid #e5e5e5;
                }

                .footer {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-top: 1.75rem;
                    padding-top: 1.25rem;
                    border-top: 1px solid #e5e5e5;
                    font-size: 0.75rem;
                    color: #a3a3a3;
                }
                .pulse-line {
                    display: inline-block;
                    width: 1.5rem;
                    height: 2px;
                    background: linear-gradient(90deg, #3b82f6, transparent);
                    border-radius: 2px;
                }

                @keyframes ping {
                    75%, 100% {
                        transform: scale(2.5);
                        opacity: 0;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .ping-ring { animation: none; }
                }
            `}</style>
        </main>
    );
}

function Row({
    label,
    icon,
    children,
    last = false,
}: {
    label: string;
    icon?: string;
    children: React.ReactNode;
    last?: boolean;
}) {
    return (
        <div
            className="row"
            style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '1rem',
                padding: '0.875rem 0',
                borderBottom: last ? 'none' : '1px solid #f0f0f0',
            }}
        >
            <dt
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.8125rem',
                    fontWeight: 400,
                    color: '#a3a3a3',
                    margin: 0,
                }}
            >
                {icon && (
                    <span
                        style={{
                            color: '#d4d4d4',
                            fontSize: '0.75rem',
                            lineHeight: 1,
                        }}
                    >
                        {icon}
                    </span>
                )}
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
