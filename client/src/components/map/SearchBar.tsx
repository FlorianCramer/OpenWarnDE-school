'use client';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { apiUrl } from './weather-overlay';

type SearchResult = { displayName: string; latitude: number; longitude: number };
export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    useEffect(() => {
        if (query.trim().length < 2) return;
        const timer = window.setTimeout(() => {
            void search(query.trim());
        }, 350);
        return () => window.clearTimeout(timer);
    }, [query]);
    async function search(value: string) {
        if (value.length < 2) return;
        setSubmitted(true);
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                apiUrl(`/api/v1/location/search?q=${encodeURIComponent(value)}`),
            );
            const body = (await response.json()) as { results?: SearchResult[]; error?: string };
            if (!response.ok) throw new Error(body.error ?? 'Suche fehlgeschlagen');
            setResults(body.results ?? []);
        } catch (searchError) {
            setError(searchError instanceof Error ? searchError.message : 'Suche fehlgeschlagen');
            setResults([]);
        } finally {
            setLoading(false);
        }
    }
    const submit = async (event: FormEvent) => {
        event.preventDefault();
        await search(query.trim());
    };
    const selectResult = (result: SearchResult) => {
        window.dispatchEvent(new CustomEvent('openwarnde:map-action', { detail: result }));
        setResults([]);
        setQuery(result.displayName);
    };
    return (
        <form
            className="pointer-events-auto absolute left-1/2 top-5 z-20 flex w-[calc(100%-2.5rem)] max-w-[340px] -translate-x-1/2 items-center rounded-full bg-white/95 px-4 py-3 shadow-lg backdrop-blur md:top-7"
            onSubmit={submit}
        >
            <Search
                className="mr-3 h-5 w-5 shrink-0 text-slate-500 md:order-2 md:ml-3 md:mr-0"
                aria-hidden="true"
            />
            <input
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                placeholder="Search"
                aria-label="Ort suchen"
                value={query}
                onChange={(event) => {
                    setQuery(event.target.value);
                    if (event.target.value.trim().length < 2) {
                        setResults([]);
                        setSubmitted(false);
                    }
                }}
                autoComplete="off"
            />
            {(loading || error || results.length > 0) && (
                <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] rounded-2xl bg-white p-2 text-left shadow-xl">
                    {loading && <p className="px-3 py-2 text-xs text-slate-500">Suche läuft …</p>}
                    {error && <p className="px-3 py-2 text-xs text-red-600">{error}</p>}
                    {!loading &&
                        !error &&
                        results.map((result) => (
                            <button
                                type="button"
                                key={`${result.latitude}-${result.longitude}`}
                                onClick={() => selectResult(result)}
                                className="block w-full rounded-xl px-3 py-2 text-left text-xs text-slate-700 hover:bg-sky-50"
                            >
                                {result.displayName}
                            </button>
                        ))}
                    {!loading && !error && submitted && results.length === 0 && (
                        <p className="px-3 py-2 text-xs text-slate-500">Kein Ort gefunden.</p>
                    )}
                </div>
            )}
        </form>
    );
}
