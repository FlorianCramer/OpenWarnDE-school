import { Header } from '@/components/ui/header';
import WarningAdminPanel from '@/components/warnings/warning-admin-panel';

export default function WarningsPage() {
    return (
        <section>
            <Header
                headline="Warnungen"
                subline="Erstelle, bearbeite und veröffentliche Warnmeldungen über das Backend."
            />
            <WarningAdminPanel />
        </section>
    );
}
