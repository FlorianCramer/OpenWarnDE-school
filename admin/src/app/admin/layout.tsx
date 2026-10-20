import type { ReactNode } from 'react';
import Sidebar, { type SidebarItem } from '@/components/ui/sidebar';
import Headbar, { type UserMenuItem } from '@/components/ui/headbar';
import {
    AppLogo,
    IconHome,
    IconDashboard,
    IconLayers,
    IconWarning,
    IconLogout,
    IconUserAccount,
    IconDevices,
} from '@/components/ui/icon';

// ── Navigation ────────────────────────────────────────────────────────────────

const adminNavigation: SidebarItem[] = [
    { label: 'Übersicht', href: '/admin', icon: <IconHome /> },
    { label: 'Dashboard', href: '/admin/dashboard', icon: <IconDashboard /> },
    { label: 'Layer-Verwaltung', href: '/admin/layers', icon: <IconLayers /> },
    { label: 'Warnungen', href: '/admin/warnings', icon: <IconWarning /> },
];

const adminFooterNavigation: SidebarItem[] = [
    { label: 'Ausloggen', href: '/', icon: <IconLogout /> },
];

// ── User-Menü (per Dropdown) ──────────────────────────────────────────────────

const userMenuItems: UserMenuItem[] = [
    { label: 'Mein Account', href: '/admin/account', icon: <IconUserAccount /> },
    { label: 'Geräte', href: '/admin/devices', icon: <IconDevices /> },
    { label: 'trenner', divider: true },
    { label: 'Ausloggen', href: '/', icon: <IconLogout />, danger: true },
];

// ── Layout ────────────────────────────────────────────────────────────────────

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[var(--background)]">
            <Sidebar
                logo={<AppLogo />}
                title="OpenWarnDE"
                subtitle="Administration"
                collapseLabel="Tabs"
                items={adminNavigation}
                footerItems={adminFooterNavigation}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <Headbar
                    userMenuItems={userMenuItems}
                    routeLabels={{
                        admin: 'Admin',
                        dashboard: 'Dashboard',
                        layers: 'Layer-Verwaltung',
                        warnings: 'Warnungen',
                    }}
                />

                <main className="flex-1 px-6 pb-6 md:px-8 md:pb-8">{children}</main>
            </div>
        </div>
    );
}
