import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    metadataBase: new URL('https://FlorianCramer.github.io/OpenWarnDE-school/'),
    //manifest: 'manifest.webmanifest',
    title: {
        default: 'OpenWarnDE 2.0 - API Server',
        template: 'API Server | %s',
    },
    description: 'OpenWarnDE 2.0 - API Server',
    applicationName: 'OpenWarnDE 2.0 - API Server',
    authors: [
        {
            name: 'Flo',
            url: 'https://floriancramer.github.io/',
        },
    ],
    creator: 'Flo',
    publisher: 'Flo',
    keywords: ['OpenWarnDE 2.0 - API Server'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" data-scribe-recorder-ready="true">
            <body>{children}</body>
        </html>
    );
}
