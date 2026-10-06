import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'OpenWarnDE Server',
    description: 'OpenWarnDE Server API',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" data-scribe-recorder-ready="true">
            <body>{children}</body>
        </html>
    );
}
