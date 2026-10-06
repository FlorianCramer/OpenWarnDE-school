// app/page.tsx
import MapWrapper from '@/components/map/MapWrapper';

export default function Page() {
    return (
        <main
            style={{
                position: 'fixed',
                inset: 0,
                height: '100dvh',
                width: '100vw',
                overflow: 'hidden',
            }}
        >
            <MapWrapper />
        </main>
    );
}