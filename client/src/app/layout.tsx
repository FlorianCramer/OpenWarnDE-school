import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'OpenWarnDE Client',
    description: 'OpenWarnDE Client Application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" data-scribe-recorder-ready="true">
            <body>{children}</body>
        </html>
    );
}
