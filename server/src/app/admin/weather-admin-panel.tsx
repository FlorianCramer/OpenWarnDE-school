'use client';

import { useEffect, useState } from 'react';
import type { WeatherConfig, WeatherSource } from '@/lib/weather/schema';
import { WEATHER_LEGEND_8 } from '@/lib/weather/palette';

function slug(name: string) {
    return (
        name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 24) || 'quelle'
    );
}

function newSource(ids: string[]): WeatherSource {
    const base = slug('neue quelle');
    let id = base;
    let n = 2;
    while (ids.includes(id)) id = `${base}-${n++}`;
    return {
        id,
        name: 'Neue Wetterquelle',
        type: 'openweathermap',
        product: 'precipitation_new',
        apiKey: '',
        urlTemplate: '',
        enabled: true,
    };
}

/* ---------- UI-Bausteine ---------- */

const inputClass =
    'w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm transition-colors placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-neutral-400 dark:focus:ring-neutral-400/10';

const buttonPrimary =
    'inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950';

const buttonSecondary =
    'inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-800 shadow-sm transition-all hover:border-neutral-300 hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:focus-visible:ring-neutral-600 dark:focus-visible:ring-offset-neutral-950';

const buttonDanger =
    'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300';

const cardClass =
    'rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900';

function Field({
    label,
    children,
    className = '',
}: {
    label: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <label className={`block ${className}`}>
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                {label}
            </span>
            {children}
        </label>
    );
}

function Badge({
    children,
    tone = 'neutral',
}: {
    children: React.ReactNode;
    tone?: 'neutral' | 'success' | 'muted';
}) {
    const tones = {
        neutral: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
        success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
        muted: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500',
    };
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${tones[tone]}`}
        >
            {children}
        </span>
    );
}

/* ---------- Component ---------- */

export default function WeatherAdminPanel() {
    const [config, setConfig] = useState<WeatherConfig | null>(null);
    const [status, setStatus] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/admin/config')
            .then(async (r) => {
                const body = await r.json();
                if (!r.ok) throw new Error(body.error);
                return body as WeatherConfig;
            })
            .then(setConfig)
            .catch((e) => setStatus(e instanceof Error ? e.message : 'Laden fehlgeschlagen'));
    }, []);

    function patchSource(id: string, patch: Partial<WeatherSource>) {
        setConfig(
            (c) =>
                c && {
                    ...c,
                    sources: c.sources.map((s) => (s.id === id ? { ...s, ...patch } : s)),
                },
        );
    }

    function weight(sourceId: string) {
        return config?.weather.inputs.find((input) => input.sourceId === sourceId)?.weight ?? 0;
    }

    function setWeight(sourceId: string, value: number) {
        setConfig(
            (c) =>
                c && {
                    ...c,
                    weather: {
                        ...c.weather,
                        inputs: [
                            ...c.weather.inputs.filter((i) => i.sourceId !== sourceId),
                            ...(value > 0 ? [{ sourceId, weight: value }] : []),
                        ],
                    },
                },
        );
    }

    async function save() {
        if (!config) return;
        setSaving(true);
        setStatus('');
        try {
            const r = await fetch('/api/admin/config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });
            const body = await r.json();
            if (!r.ok)
                throw new Error(
                    body.issues?.map((i: { message: string }) => i.message).join(' ') || body.error,
                );
            setConfig(body);
            setStatus(
                'Gespeichert. Der Wetterlayer wird ab jetzt mit dieser Konfiguration berechnet.',
            );
        } catch (e) {
            setStatus(e instanceof Error ? e.message : 'Speichern fehlgeschlagen');
        } finally {
            setSaving(false);
        }
    }

    if (!config) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-8 dark:bg-neutral-950">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100" />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Wetterquellen werden geladen… {status}
                    </p>
                </div>
            </div>
        );
    }

    // Gesamtgewicht der aktiven Quellen für prozentuale Anzeige
    const totalWeight = config.weather.inputs.reduce((sum, input) => {
        const source = config.sources.find((s) => s.id === input.sourceId);
        return source?.enabled ? sum + input.weight : sum;
    }, 0);

    const savedStatus = status.startsWith('Gespeichert');

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
            <main className="mx-auto max-w-4xl space-y-8 px-6 py-10">
                {/* Header */}
                <header className="flex flex-wrap items-end justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                            Wetterquellen
                        </h1>
                        <p className="max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                            Der Server berechnet aus den aktivierten Quellen einen Regen-Konsens.
                            API-Schlüssel bleiben auf dem Server.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={save}
                        disabled={saving}
                        className={buttonPrimary}
                    >
                        {saving ? (
                            <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-neutral-900/30 dark:border-t-neutral-900" />
                                Speichert…
                            </>
                        ) : (
                            'Speichern'
                        )}
                    </button>
                </header>

                {/* Status */}
                {status ? (
                    <div
                        className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
                            savedStatus
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300'
                        }`}
                    >
                        <span className="mt-0.5">
                            {savedStatus ? (
                                <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            ) : (
                                <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8v4M12 16h.01" />
                                </svg>
                            )}
                        </span>
                        <span>{status}</span>
                    </div>
                ) : null}

                {/* Quellen */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                                Quellen
                            </h2>
                            <Badge tone="muted">{config.sources.length}</Badge>
                        </div>
                        <button
                            type="button"
                            className={buttonSecondary}
                            onClick={() =>
                                setConfig({
                                    ...config,
                                    sources: [
                                        ...config.sources,
                                        newSource(config.sources.map((s) => s.id)),
                                    ],
                                })
                            }
                        >
                            <svg
                                className="h-3.5 w-3.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            >
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Quelle hinzufügen
                        </button>
                    </div>

                    {config.sources.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-500">
                            Noch keine Wetterquelle angelegt.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {config.sources.map((source) => {
                                const w = weight(source.id);
                                const share =
                                    source.enabled && w > 0 && totalWeight > 0
                                        ? Math.round((w / totalWeight) * 100)
                                        : 0;
                                return (
                                    <article key={source.id} className={cardClass}>
                                        <div className="mb-4 flex items-start justify-between gap-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                                                    {source.name || 'Unbenannt'}
                                                </h3>
                                                {source.enabled ? (
                                                    <Badge tone="success">aktiv</Badge>
                                                ) : (
                                                    <Badge tone="muted">inaktiv</Badge>
                                                )}
                                                <Badge>{source.type}</Badge>
                                                {source.enabled && w > 0 ? (
                                                    <Badge>{share} %</Badge>
                                                ) : null}
                                            </div>
                                            <button
                                                type="button"
                                                className={buttonDanger}
                                                onClick={() => {
                                                    if (
                                                        !window.confirm(
                                                            `Quelle „${source.name}“ löschen?`,
                                                        )
                                                    )
                                                        return;
                                                    setConfig({
                                                        ...config,
                                                        sources: config.sources.filter(
                                                            (s) => s.id !== source.id,
                                                        ),
                                                        weather: {
                                                            ...config.weather,
                                                            inputs: config.weather.inputs.filter(
                                                                (i) => i.sourceId !== source.id,
                                                            ),
                                                        },
                                                    });
                                                }}
                                            >
                                                <svg
                                                    className="h-3.5 w-3.5"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                </svg>
                                                Löschen
                                            </button>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <Field label="Name">
                                                <input
                                                    className={inputClass}
                                                    value={source.name}
                                                    onChange={(e) =>
                                                        patchSource(source.id, {
                                                            name: e.target.value,
                                                        })
                                                    }
                                                />
                                            </Field>
                                            <Field label="Typ">
                                                <select
                                                    className={inputClass}
                                                    value={source.type}
                                                    onChange={(e) =>
                                                        patchSource(source.id, {
                                                            type: e.target
                                                                .value as WeatherSource['type'],
                                                        })
                                                    }
                                                >
                                                    <option value="rainviewer">
                                                        RainViewer Radar
                                                    </option>
                                                    <option value="openweathermap">
                                                        OpenWeatherMap
                                                    </option>
                                                    <option value="dwd-radolan">DWD RADOLAN</option>
                                                    <option value="radrview">RadrView</option>
                                                    <option value="xyz">
                                                        Eigene Wetter-Tile-Quelle
                                                    </option>
                                                </select>
                                            </Field>

                                            {source.type !== 'xyz' ? (
                                                <Field label="Produkt">
                                                    <input
                                                        className={inputClass}
                                                        value={source.product}
                                                        onChange={(e) =>
                                                            patchSource(source.id, {
                                                                product: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </Field>
                                            ) : null}

                                            {source.type !== 'rainviewer' &&
                                            source.type !== 'dwd-radolan' &&
                                            source.type !== 'radrview' ? (
                                                <Field label="API-Key">
                                                    <input
                                                        type="password"
                                                        autoComplete="off"
                                                        className={inputClass}
                                                        value={source.apiKey}
                                                        onChange={(e) =>
                                                            patchSource(source.id, {
                                                                apiKey: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </Field>
                                            ) : null}

                                            {source.type === 'radrview' ? (
                                                <Field label="RadrView-Basis-URL">
                                                    <input
                                                        className={`${inputClass} font-mono text-xs`}
                                                        value={source.urlTemplate}
                                                        onChange={(e) =>
                                                            patchSource(source.id, {
                                                                urlTemplate: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </Field>
                                            ) : null}

                                            {source.type === 'xyz' ? (
                                                <Field
                                                    label="Wetter-Tile-URL mit {z}, {x}, {y}"
                                                    className="md:col-span-2"
                                                >
                                                    <input
                                                        className={`${inputClass} font-mono text-xs`}
                                                        placeholder="https://example/{z}/{x}/{y}.png"
                                                        value={source.urlTemplate}
                                                        onChange={(e) =>
                                                            patchSource(source.id, {
                                                                urlTemplate: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </Field>
                                            ) : null}
                                        </div>

                                        {/* Footer-Zeile: aktiv + Gewicht */}
                                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                                            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:focus:ring-neutral-400"
                                                    checked={source.enabled}
                                                    onChange={(e) =>
                                                        patchSource(source.id, {
                                                            enabled: e.target.checked,
                                                        })
                                                    }
                                                />
                                                Quelle aktiv
                                            </label>

                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                                                    Gewicht
                                                </span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    className="w-20 rounded-lg border border-neutral-200 bg-white px-2 py-1 text-center text-sm shadow-sm focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-neutral-400"
                                                    value={w}
                                                    onChange={(e) =>
                                                        setWeight(
                                                            source.id,
                                                            Number(e.target.value) || 0,
                                                        )
                                                    }
                                                />
                                                <span className="w-10 text-right text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
                                                    {share} %
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Globale Wetterlayer-Einstellungen */}
                <section className={cardClass}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                            Wetterlayer
                        </h2>
                        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:focus:ring-neutral-400"
                                checked={config.weather.enabled}
                                onChange={(e) =>
                                    setConfig({
                                        ...config,
                                        weather: {
                                            ...config.weather,
                                            enabled: e.target.checked,
                                        },
                                    })
                                }
                            />
                            Aktiv
                        </label>
                    </div>

                    <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            <span>Deckkraft</span>
                            <span className="tabular-nums text-neutral-900 dark:text-neutral-100">
                                {Math.round(config.weather.opacity * 100)} %
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={Math.round(config.weather.opacity * 100)}
                            onChange={(e) =>
                                setConfig({
                                    ...config,
                                    weather: {
                                        ...config.weather,
                                        opacity: Number(e.target.value) / 100,
                                    },
                                })
                            }
                            className="w-full accent-neutral-900 dark:accent-neutral-100"
                        />
                    </div>

                    {/* Farb-Legende */}
                    <div className="mt-6 space-y-3">
                        <div className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            Intensitäts-Skala
                        </div>
                        <div className="flex h-3 w-full overflow-hidden rounded-full">
                            {WEATHER_LEGEND_8.map((item) => (
                                <div
                                    key={item.color}
                                    className="flex-1"
                                    style={{ backgroundColor: item.color }}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between text-[10px] font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            <span>leicht</span>
                            <span>mäßig</span>
                            <span>extrem</span>
                        </div>
                    </div>

                    <div className="mt-5 overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
                        <table className="w-full min-w-[760px] text-left text-xs">
                            <thead className="bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
                                <tr>
                                    <th className="px-3 py-2 font-medium">Farbe</th>
                                    <th className="px-3 py-2 font-medium">Radarwert</th>
                                    <th className="px-3 py-2 font-medium">Intensität</th>
                                    <th className="px-3 py-2 font-medium">Niederschlag</th>
                                    <th className="px-3 py-2 font-medium">Beschreibung</th>
                                </tr>
                            </thead>
                            <tbody>
                                {WEATHER_LEGEND_8.map((item) => (
                                    <tr
                                        key={item.color}
                                        className="border-t border-neutral-200 dark:border-neutral-800"
                                    >
                                        <td className="whitespace-nowrap px-3 py-2 font-medium">
                                            <span
                                                className="mr-2 inline-block h-3 w-3 rounded-full"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            {item.name}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-2">
                                            {item.radar}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-2">
                                            {item.intensity}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-2">
                                            {item.precipitation}
                                        </td>
                                        <td className="px-3 py-2">{item.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                        Die Gewichte bestimmen den Quellenkonsens. Die Ausgabe verwendet die acht
                        Klassen. Dunkelblau, Gelb und Orange/Rot für steigende Regenintensität; die
                        Transparenz zeigt die Übereinstimmung der Quellen.
                    </p>
                </section>
            </main>
        </div>
    );
}
