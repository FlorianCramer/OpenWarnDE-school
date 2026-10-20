'use client';

import type { ReactNode } from 'react';

export type StatusType = 'warn' | 'warning' | 'info' | 'error' | 'success';

type BaseCard = {
    header: boolean;
    headline: string;
    subline?: string;
    icon?: ReactNode;
};

export type CardContent =
    | (BaseCard & { contenttype: 'number'; content: string }) // z. B. '0'
    | (BaseCard & { contenttype: 'string'; content: string }) // z. B. 'Hallo'
    | (BaseCard & { contenttype: 'time';   content: string }) // z. B. '14:32 Uhr'
    | (BaseCard & { contenttype: 'date';   content: string }) // z. B. '26.10.2026'
    | (BaseCard & { contenttype: 'html';   content: string }) // `<p>Inhalt</p>`
    | (BaseCard & { contenttype: 'status'; content: string; statustype: StatusType });

export type CardProps = CardContent;

export function Card(props: CardProps) {
    const { header, headline, subline, icon, content } = props;
    const showHeader = header && !!headline;

    const renderContent = () => {
        switch (props.contenttype) {
            case 'number':
                return (
                    <p className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] tabular-nums">
                        {content}
                    </p>
                );

            case 'string':
                return (
                    <p className="text-base font-medium leading-relaxed text-[var(--foreground)]">
                        {content}
                    </p>
                );

            case 'time':
                return (
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--muted)] text-[var(--secondary)]">
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden="true"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </span>
                        <span className="text-2xl font-bold tracking-tight text-[var(--foreground)] tabular-nums">
                            {content}
                        </span>
                    </div>
                );

            case 'date':
                return (
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--muted)] text-[var(--secondary)]">
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden="true"
                            >
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </span>
                        <span className="text-2xl font-bold tracking-tight text-[var(--foreground)] tabular-nums">
                            {content}
                        </span>
                    </div>
                );

            case 'status': {
                const normalizedType = props.statustype === 'warning' ? 'warn' : props.statustype;

                const statusStyles: Record<
                    'warn' | 'info' | 'error' | 'success',
                    {
                        container: string;
                        dotBg: string;
                        pulse: boolean;
                        icon: ReactNode;
                        defaultLabel: string;
                    }
                > = {
                    success: {
                        container:
                            'bg-emerald-50/90 text-emerald-900 ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-300',
                        dotBg: 'bg-[var(--success)]',
                        pulse: true,
                        defaultLabel: 'Erfolgreich',
                        icon: (
                            <svg
                                className="h-4 w-4 shrink-0 text-[var(--success)]"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ),
                    },
                    warn: {
                        container:
                            'bg-amber-50/90 text-amber-900 ring-amber-600/25 dark:bg-amber-950/40 dark:text-amber-300',
                        dotBg: 'bg-[var(--warning)]',
                        pulse: false,
                        defaultLabel: 'Warnung',
                        icon: (
                            <svg
                                className="h-4 w-4 shrink-0 text-[var(--warning)]"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ),
                    },
                    error: {
                        container:
                            'bg-rose-50/90 text-rose-900 ring-rose-600/25 dark:bg-rose-950/40 dark:text-rose-300',
                        dotBg: 'bg-[var(--destructive)]',
                        pulse: false,
                        defaultLabel: 'Fehler',
                        icon: (
                            <svg
                                className="h-4 w-4 shrink-0 text-[var(--destructive)]"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ),
                    },
                    info: {
                        container:
                            'bg-sky-50/90 text-sky-900 ring-sky-600/20 dark:bg-sky-950/40 dark:text-sky-300',
                        dotBg: 'bg-[var(--secondary)]',
                        pulse: false,
                        defaultLabel: 'Info',
                        icon: (
                            <svg
                                className="h-4 w-4 shrink-0 text-[var(--secondary)]"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ),
                    },
                };

                const current = statusStyles[normalizedType] ?? statusStyles.info;

                return (
                    <div className="flex items-center">
                        <div
                            className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold shadow-xs ring-1 ring-inset ${current.container}`}
                        >
                            {current.pulse ? (
                                <span className="relative flex h-2.5 w-2.5 shrink-0">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                    <span
                                        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${current.dotBg}`}
                                    />
                                </span>
                            ) : (
                                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${current.dotBg}`} />
                            )}
                            {current.icon}
                            <span>{content || current.defaultLabel}</span>
                        </div>
                    </div>
                );
            }

            case 'html':
            default:
                return (
                    <div
                        className="text-sm text-[var(--foreground)]"
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                );
        }
    };

    return (
        <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md">
            {showHeader && (
                <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                        <p className="text-sm font-medium text-[var(--muted-foreground)]">
                            {headline}
                        </p>
                        {subline && (
                            <p className="mt-0.5 text-xs text-[var(--muted-foreground)] opacity-80">
                                {subline}
                            </p>
                        )}
                    </div>
                    {icon && (
                        <span className="shrink-0 text-[var(--muted-foreground)]" aria-hidden="true">
                            {icon}
                        </span>
                    )}
                </div>
            )}
            <div className={showHeader ? 'mt-auto pt-2' : ''}>
                {renderContent()}
            </div>
        </div>
    );
}

export type CardRowProps = {
    cards: CardContent[];
    height?: number;
};

export function CardRow({ cards, height }: CardRowProps) {
    if (cards.length === 0) return null;
    if (cards.length > 3) {
        throw new Error('CardRow unterstützt maximal 3 Karten.');
    }

    const cols =
        cards.length === 1
            ? 'grid-cols-1'
            : cards.length === 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3';

    const baseHeight = '10rem';
    const gap = '1.25rem';

    const rowStyle = height
        ? { height: `calc(${height} * ${baseHeight} + ${height - 1} * ${gap})` }
        : undefined;

    return (
        <div className={`mt-8 grid gap-5 ${cols}`} style={rowStyle}>
            {cards.map((c, i) => (
                <Card key={`${c.headline}-${i}`} {...c} />
            ))}
        </div>
    );
}