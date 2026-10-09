import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://127.0.0.1:3001'),
    //manifest: 'manifest.webmanifest',
    title: {
        default: 'OpenWarnDE 2.0 - Verwaltung',
        template: 'Verwaltung | %s',
    },
    description: 'OpenWarnDE 2.0 - Verwaltungsoberfläche',
    applicationName: 'OpenWarnDE 2.0 - Verwaltung',
    authors: [
        {
            name: 'Flo',
            url: 'https://floriancramer.github.io/',
        },
    ],
    creator: 'Flo',
    publisher: 'Flo',
    keywords: ['OpenWarnDE 2.0 - Verwaltung'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="de" suppressHydrationWarning>
            <body>{children}</body>
        </html>
    );
}
