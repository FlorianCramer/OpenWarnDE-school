import { Header } from '@/components/ui/header';
import { CardRow, type CardContent } from '@/components/ui/card';

export default function AdminPage() {
    const row1: CardContent[] = [
        {
            header: true,
            headline: 'Aktive Warnungen',
            contenttype: 'number',
            content: '0',
        },
        {
            header: true,
            headline: 'Karten-Layer',
            contenttype: 'number',
            content: '2',
        },
        {
            header: true,
            headline: 'Status',
            contenttype: 'status',
            statustype: 'success',
            content: 'very good',
        },
    ];

    return (
        <div>
            <p className="text-sm font-semibold tracking-wide uppercase text-[var(--primary)] mb-1">
                Willkommen zurück
            </p>

            <Header
                headline="Übersicht"
                subline="Verwalte Warnmeldungen und Karten-Layer zentral über das OpenWarnDE 2.0 Backend."
            />

            <CardRow height={8} cards={row1} />
        </div>
    );
}
