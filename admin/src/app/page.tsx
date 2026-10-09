import type { Metadata } from 'next';
import AdminPanel from './admin/weather-admin-panel';

export const metadata: Metadata = {
    title: 'Layer-Verwaltung',
};

export default function AdminPage() {
    return <AdminPanel />;
}
