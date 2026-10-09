import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_CLIENT_URL ?? 'http://127.0.0.1:3000'),
    //manifest: 'manifest.webmanifest',
    title: {
        default: 'OpenWarnDE 2.0',
        template: '%s | OpenWarnDE 2.0',
    },
    description: 'Eine App für alles Wetter :)',
    applicationName: 'OpenWarnDE 2.0',
    authors: [
        {
            name: 'Flo',
            url: 'https://floriancramer.github.io/',
        },
    ],
    creator: 'Flo',
    publisher: 'Flo',
    keywords: ['OpenWarnDE 2.0'],
    openGraph: {
        type: 'website',
        locale: 'de_DE',
        title: 'OpenWarnDE 2.0',
        description: 'Eine App für alles Wetter :)',
        siteName: 'OpenWarnDE 2.0',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="de" suppressHydrationWarning>
            <body>{children}</body>
        </html>
    );
}
