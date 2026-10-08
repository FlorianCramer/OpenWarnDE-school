'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { AppConfig, DataSource, MapLayer } from '@/lib/layers/schema';

const BASEMAPS = [
    {
        name: 'OpenStreetMap',
        urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
    },
    {
        name: 'OpenTopoMap',
        urlTemplate: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution:
            'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
        maxZoom: 17,
    },
    {
        name: 'Satellit (Esri)',
        urlTemplate:
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
        maxZoom: 19,
    },
] as const;

const OWM_PRODUCTS = [
    ['precipitation_new', 'Niederschlag'],
    ['clouds_new', 'Wolken'],
    ['temp_new', 'Temperatur'],
    ['wind_new', 'Wind'],
    ['pressure_new', 'Luftdruck'],
] as const;

function slug(name: string) {
    const base =
        name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 24) || 'eintrag';
    return base;
}

function uniqueId(name: string, taken: string[]) {
    const base = slug(name);
    if (!taken.includes(base)) return base;
    let n = 2;
    while (taken.includes(`${base}-${n}`)) n += 1;
    return `${base}-${n}`;
}

function emptySource(taken: string[]): DataSource {
    return {
        id: uniqueId('quelle', taken),
        name: 'Neue Quelle',
        type: 'openweathermap',
        product: 'precipitation_new',
        apiKey: '',
        urlTemplate: '',
        enabled: true,
    };
}

function emptyLayer(taken: string[]): MapLayer {
    return {
        id: uniqueId('layer', taken),
        name: 'Neuer Layer',
        enabled: true,
        basemap: { ...BASEMAPS[0] },
        weather: { opacity: 0.7, inputs: [] },
    };
}

export default function AdminPanel() {
    const [config, setConfig] = useState<AppConfig | null>(null);
    const [status, setStatus] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;
        fetch('/api/admin/config')
            .then(async (response) => {
                const body = await response.json();
                if (!response.ok) throw new Error(body.error ?? 'Laden fehlgeschlagen');
                return body as AppConfig;
            })
            .then((body) => {
                if (!cancelled) setConfig(body);
            })
            .catch((error: unknown) => {
                if (!cancelled) {
                    setStatus(error instanceof Error ? error.message : 'Laden fehlgeschlagen');
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    function patchSource(id: string, patch: Partial<DataSource>) {
        setConfig((prev) =>
            prev
                ? {
                      ...prev,
                      sources: prev.sources.map((source) =>
                          source.id === id ? { ...source, ...patch } : source,
                      ),
                  }
                : prev,
        );
    }

    function patchLayer(id: string, patch: Partial<MapLayer>) {
        setConfig((prev) =>
            prev
                ? {
                      ...prev,
                      layers: prev.layers.map((layer) =>
                          layer.id === id ? { ...layer, ...patch } : layer,
                      ),
                  }
                : prev,
        );
    }

    function weightFor(layer: MapLayer, sourceId: string) {
        return layer.weather.inputs.find((input) => input.sourceId === sourceId)?.weight ?? 0;
    }

    function setWeight(layerId: string, sourceId: string, weight: number) {
        setConfig((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                layers: prev.layers.map((layer) => {
                    if (layer.id !== layerId) return layer;
                    const others = layer.weather.inputs.filter(
                        (input) => input.sourceId !== sourceId,
                    );
                    const inputs = weight > 0 ? [...others, { sourceId, weight }] : others;
                    return { ...layer, weather: { ...layer.weather, inputs } };
                }),
            };
        });
    }

    async function save() {
        if (!config) return;
        setSaving(true);
        setStatus('');
        try {
            const response = await fetch('/api/admin/config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });
            const body = await response.json();
            if (!response.ok) {
                const detail = Array.isArray(body.issues)
                    ? body.issues.map((issue: { message?: string }) => issue.message).join(' ')
                    : body.error;
                throw new Error(detail || 'Speichern fehlgeschlagen');
            }
            setConfig(body as AppConfig);
            setStatus('Gespeichert. Der Client lädt die Layer beim nächsten Öffnen.');
        } catch (error) {
            setStatus(error instanceof Error ? error.message : 'Speichern fehlgeschlagen');
        } finally {
            setSaving(false);
        }
    }

    if (!config) {
        return <p className="p-8 text-sm">Konfiguration wird geladen… {status}</p>;
    }

    return (
        <div className="mx-auto max-w-5xl space-y-8 p-6">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold">Layer-Verwaltung</h1>
                    <p className="max-w-2xl text-sm text-neutral-600">
                        Lege Wetterquellen mit Schlüssel an und hänge sie mit einem Gewicht an einen
                        Layer. Der Client holt nur diese Layerliste und setzt genau einen davon.
                        Schlüssel bleiben auf dem Server.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/" className="rounded-lg border px-3 py-2 text-sm">
                        Übersicht
                    </Link>
                    <button
                        type="button"
                        onClick={save}
                        disabled={saving}
                        className="rounded-lg bg-neutral-900 px-3 py-2 text-sm text-white disabled:opacity-50"
                    >
                        {saving ? 'Speichert…' : 'Speichern'}
                    </button>
                </div>
            </header>
            {status ? <p className="text-sm">{status}</p> : null}

            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Wetter-Datenquellen</h2>
                    <button
                        type="button"
                        className="rounded-lg border px-3 py-1.5 text-sm"
                        onClick={() =>
                            setConfig({
                                ...config,
                                sources: [
                                    ...config.sources,
                                    emptySource(config.sources.map((source) => source.id)),
                                ],
                            })
                        }
                    >
                        Quelle hinzufügen
                    </button>
                </div>
                {config.sources.map((source) => (
                    <article key={source.id} className="space-y-3 rounded-xl border p-4">
                        <div className="grid gap-3 md:grid-cols-2">
                            <label className="block text-sm">
                                Name
                                <input
                                    className="mt-1 w-full rounded border px-2 py-1"
                                    value={source.name}
                                    onChange={(event) =>
                                        patchSource(source.id, { name: event.target.value })
                                    }
                                />
                            </label>
                            <label className="block text-sm">
                                Typ
                                <select
                                    className="mt-1 w-full rounded border px-2 py-1"
                                    value={source.type}
                                    onChange={(event) => {
                                        const type = event.target.value as DataSource['type'];
                                        patchSource(source.id, {
                                            type,
                                            product:
                                                type === 'openweathermap'
                                                    ? 'precipitation_new'
                                                    : type === 'rainviewer'
                                                      ? '2'
                                                      : source.product,
                                        });
                                    }}
                                >
                                    <option value="openweathermap">OpenWeatherMap</option>
                                    <option value="rainviewer">RainViewer Radar</option>
                                    <option value="xyz">Eigene Tile-URL</option>
                                </select>
                            </label>
                            {source.type === 'openweathermap' ? (
                                <label className="block text-sm">
                                    Produkt
                                    <select
                                        className="mt-1 w-full rounded border px-2 py-1"
                                        value={source.product}
                                        onChange={(event) =>
                                            patchSource(source.id, { product: event.target.value })
                                        }
                                    >
                                        {OWM_PRODUCTS.map(([id, label]) => (
                                            <option key={id} value={id}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            ) : null}
                            {source.type === 'rainviewer' ? (
                                <label className="block text-sm">
                                    Farbschema (0-8)
                                    <input
                                        className="mt-1 w-full rounded border px-2 py-1"
                                        value={source.product}
                                        onChange={(event) =>
                                            patchSource(source.id, { product: event.target.value })
                                        }
                                    />
                                </label>
                            ) : null}
                            {source.type !== 'rainviewer' ? (
                                <label className="block text-sm">
                                    API-Key
                                    <input
                                        className="mt-1 w-full rounded border px-2 py-1"
                                        type="password"
                                        autoComplete="off"
                                        value={source.apiKey}
                                        onChange={(event) =>
                                            patchSource(source.id, { apiKey: event.target.value })
                                        }
                                    />
                                </label>
                            ) : null}
                            {source.type === 'xyz' ? (
                                <label className="block text-sm md:col-span-2">
                                    URL-Vorlage
                                    <input
                                        className="mt-1 w-full rounded border px-2 py-1"
                                        value={source.urlTemplate}
                                        placeholder="https://example/{z}/{x}/{y}.png?key={apiKey}"
                                        onChange={(event) =>
                                            patchSource(source.id, {
                                                urlTemplate: event.target.value,
                                            })
                                        }
                                    />
                                </label>
                            ) : null}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={source.enabled}
                                    onChange={(event) =>
                                        patchSource(source.id, { enabled: event.target.checked })
                                    }
                                />{' '}
                                aktiv
                            </label>
                            <button
                                type="button"
                                className="text-red-700"
                                onClick={() => {
                                    if (!window.confirm(`Quelle „${source.name}“ löschen?`)) return;
                                    setConfig({
                                        ...config,
                                        sources: config.sources.filter(
                                            (item) => item.id !== source.id,
                                        ),
                                        layers: config.layers.map((layer) => ({
                                            ...layer,
                                            weather: {
                                                ...layer.weather,
                                                inputs: layer.weather.inputs.filter(
                                                    (input) => input.sourceId !== source.id,
                                                ),
                                            },
                                        })),
                                    });
                                }}
                            >
                                Löschen
                            </button>
                        </div>
                    </article>
                ))}
            </section>

            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Layer</h2>
                    <button
                        type="button"
                        className="rounded-lg border px-3 py-1.5 text-sm"
                        onClick={() =>
                            setConfig({
                                ...config,
                                layers: [
                                    ...config.layers,
                                    emptyLayer(config.layers.map((layer) => layer.id)),
                                ],
                            })
                        }
                    >
                        Layer hinzufügen
                    </button>
                </div>
                <p className="text-sm text-neutral-600">
                    Gewichte sind relativ. 70 und 30 ergeben 70 % und 30 %. Quellen mit Gewicht 0
                    gehören nicht zu diesem Layer. In einem Layer sollten nur Quellen derselben
                    Größe liegen, zum Beispiel nur Niederschlag. Die Kacheln werden farblich
                    gemischt.
                </p>
                {config.layers.map((layer) => {
                    const activeSum = config.sources.reduce((sum, source) => {
                        if (!source.enabled) return sum;
                        return sum + weightFor(layer, source.id);
                    }, 0);
                    return (
                        <article key={layer.id} className="space-y-3 rounded-xl border p-4">
                            <div className="grid gap-3 md:grid-cols-2">
                                <label className="block text-sm">
                                    Name
                                    <input
                                        className="mt-1 w-full rounded border px-2 py-1"
                                        value={layer.name}
                                        onChange={(event) =>
                                            patchLayer(layer.id, { name: event.target.value })
                                        }
                                    />
                                </label>
                                <label className="block text-sm">
                                    Basiskarte
                                    <select
                                        className="mt-1 w-full rounded border px-2 py-1"
                                        value={
                                            BASEMAPS.find(
                                                (preset) =>
                                                    preset.urlTemplate ===
                                                    layer.basemap.urlTemplate,
                                            )?.urlTemplate ?? 'custom'
                                        }
                                        onChange={(event) => {
                                            const preset = BASEMAPS.find(
                                                (item) => item.urlTemplate === event.target.value,
                                            );
                                            if (!preset) return;
                                            patchLayer(layer.id, {
                                                basemap: {
                                                    urlTemplate: preset.urlTemplate,
                                                    attribution: preset.attribution,
                                                    maxZoom: preset.maxZoom,
                                                },
                                            });
                                        }}
                                    >
                                        {BASEMAPS.map((preset) => (
                                            <option
                                                key={preset.urlTemplate}
                                                value={preset.urlTemplate}
                                            >
                                                {preset.name}
                                            </option>
                                        ))}
                                        <option value="custom">Eigene URL</option>
                                    </select>
                                </label>
                                <label className="block text-sm md:col-span-2">
                                    Tile-URL der Basiskarte
                                    <input
                                        className="mt-1 w-full rounded border px-2 py-1"
                                        value={layer.basemap.urlTemplate}
                                        onChange={(event) =>
                                            patchLayer(layer.id, {
                                                basemap: {
                                                    ...layer.basemap,
                                                    urlTemplate: event.target.value,
                                                },
                                            })
                                        }
                                    />
                                </label>
                                <label className="block text-sm">
                                    Deckkraft Wetter {Math.round(layer.weather.opacity * 100)} %
                                    <input
                                        className="mt-1 w-full"
                                        type="range"
                                        min={0}
                                        max={100}
                                        value={Math.round(layer.weather.opacity * 100)}
                                        onChange={(event) =>
                                            patchLayer(layer.id, {
                                                weather: {
                                                    ...layer.weather,
                                                    opacity: Number(event.target.value) / 100,
                                                },
                                            })
                                        }
                                    />
                                </label>
                            </div>
                            <div className="space-y-2">
                                {config.sources.map((source) => {
                                    const weight = weightFor(layer, source.id);
                                    const share =
                                        source.enabled && weight > 0 && activeSum > 0
                                            ? Math.round((weight / activeSum) * 100)
                                            : 0;
                                    return (
                                        <label
                                            key={source.id}
                                            className="grid grid-cols-[1fr_6rem_4rem] items-center gap-3 text-sm"
                                        >
                                            <span>
                                                {source.name}
                                                {!source.enabled ? ' (aus)' : ''}
                                            </span>
                                            <input
                                                type="number"
                                                min={0}
                                                max={100}
                                                className="rounded border px-2 py-1"
                                                value={weight}
                                                onChange={(event) =>
                                                    setWeight(
                                                        layer.id,
                                                        source.id,
                                                        Number(event.target.value) || 0,
                                                    )
                                                }
                                            />
                                            <span className="text-neutral-500">{share} %</span>
                                        </label>
                                    );
                                })}
                                {config.sources.length === 0 ? (
                                    <p className="text-sm text-neutral-500">
                                        Noch keine Datenquelle angelegt.
                                    </p>
                                ) : null}
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={layer.enabled}
                                        onChange={(event) =>
                                            patchLayer(layer.id, { enabled: event.target.checked })
                                        }
                                    />{' '}
                                    im Client anzeigen
                                </label>
                                <button
                                    type="button"
                                    className="text-red-700"
                                    disabled={config.layers.length < 2}
                                    onClick={() => {
                                        if (!window.confirm(`Layer „${layer.name}“ löschen?`))
                                            return;
                                        setConfig({
                                            ...config,
                                            layers: config.layers.filter(
                                                (item) => item.id !== layer.id,
                                            ),
                                        });
                                    }}
                                >
                                    Löschen
                                </button>
                            </div>
                        </article>
                    );
                })}
            </section>
        </div>
    );
}
