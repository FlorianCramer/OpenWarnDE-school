import { Header } from '@/components/ui/header';
import WeatherAdminPanel from '../weather-admin-panel';

export default function LayersPage() {
    return (
        <section className="space-y-6">
            <Header
                headline="Layer-Verwaltung"
                subline="Verwalte Karten-Layer, Datenquellen und Darstellungsparameter."
            />
            <WeatherAdminPanel />
        </section>
    );
}
