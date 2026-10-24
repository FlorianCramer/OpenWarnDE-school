'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { IconSettings, IconUser, IconChevronRight } from './icon';
import Dropdown, { type DropdownItem } from './dropdown';

export type UserMenuItem = DropdownItem;

type HeadbarProps = {
    routeLabels?: Record<string, string>;
    actions?: ReactNode;
    settingsIcon?: ReactNode;
    userIcon?: ReactNode;
    onSettings?: () => void;
    userMenuItems?: UserMenuItem[];
};

const DEFAULT_ROUTE_LABELS: Record<string, string> = {
    admin: 'Admin',
    dashboard: 'Dashboard',
    layers: 'Layer-Verwaltung',
    warnings: 'Warnungen',
    settings: 'Einstellungen',
    users: 'Benutzer',
    account: 'Mein Account',
    devices: 'Geräte'
};

const DEFAULT_USER_MENU: UserMenuItem[] = [{ label: 'Abmelden' }];

export default function Headbar({
    routeLabels,
    actions,
    settingsIcon,
    userIcon,
    onSettings,
    userMenuItems = DEFAULT_USER_MENU,
}: HeadbarProps) {
    const pathname = usePathname();

    const labels = { ...DEFAULT_ROUTE_LABELS, ...routeLabels };
    const segments = pathname.split('/').filter(Boolean);

    const crumbs = segments.map((seg, i) => {
        const href = '/' + segments.slice(0, i + 1).join('/');
        const label = labels[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
        return { href, label, isLast: i === segments.length - 1 };
    });

    return (
        <header className="mx-4 mt-4 mb-4 flex h-14 items-center justify-between rounded-full bg-(--card) px-5 shadow-md shadow-slate-900/10 ring-1 ring-[var(--border)]">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-1 text-sm">
                    {crumbs.map((crumb) => (
                        <li key={crumb.href} className="flex items-center gap-1">
                            {!crumb.isLast ? (
                                <>
                                    <Link
                                        href={crumb.href}
                                        className="cursor-pointer text-slate-400 transition hover:text-slate-700"
                                    >
                                        {crumb.label}
                                    </Link>
                                    <IconChevronRight />
                                </>
                            ) : (
                                <span className="font-semibold text-slate-900">{crumb.label}</span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>

            {/* optionale Actions + Einstellungen + User-Dropdown */}
            <div className="flex items-center gap-2">
                {actions && <div className="flex items-center gap-2">{actions}</div>}

                {/* Einstellungs-Button */}
                <button
                    type="button"
                    aria-label="Einstellungen"
                    onClick={onSettings}
                    className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-[var(--muted)] hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                >
                    {settingsIcon ?? <IconSettings />}
                </button>

                {/* User-Icon mit schwebendem Dropdown (nur bei Klick geöffnet) */}
                <Dropdown
                    items={userMenuItems}
                    align="right"
                    trigger={
                        <div
                            aria-label="Benutzermenü"
                            className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
                        >
                            {userIcon ?? <IconUser />}
                        </div>
                    }
                />
            </div>
        </header>
    );
}
