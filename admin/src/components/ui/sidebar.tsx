'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useId, useState, type ReactNode } from 'react';

export type SidebarItem = {
    label: string;
    href?: string;
    onClick?: () => void;
    /** ReactNode (z.B. JSX-SVG) oder SVG-Markup-String */
    icon?: ReactNode;
    /** Rohes SVG-Markup das direkt gerendert wird */
    svgIcon?: string;
};

type SidebarProps = {
    /** Logo-Bereich: liegt auf dem Haupt-Hintergrund auf gleicher Höhe wie der Header */
    logo?: ReactNode;
    /** Textlicher Titel neben dem Logo */
    title?: string;
    subtitle?: string;
    /** Haupt-Navigations-Punkte */
    items: SidebarItem[];
    /** Footer-Aktionen/Links als SidebarItem (z.B. Abmelden, Hilfe) */
    footerItems?: SidebarItem[];
    /** Beliebiger optionaler Footer-Inhalt */
    footer?: ReactNode;
    /** Text neben dem Einklapp-Button (z.B. 'Tabs' oder 'Menü') */
    collapseLabel?: string;
    /** Startzustand der Sidebar; Standard: ausgeklappt */
    defaultCollapsed?: boolean;
};

/** Rendert ein Icon, unterstützt ReactNode und SVG-Strings */
function renderItemIcon(icon?: ReactNode, svgIcon?: string) {
    if (svgIcon) {
        return (
            <span
                aria-hidden="true"
                className="flex h-5 w-5 shrink-0 items-center justify-center"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: svgIcon }}
            />
        );
    }

    if (typeof icon === 'string' && icon.trim().startsWith('<svg')) {
        return (
            <span
                aria-hidden="true"
                className="flex h-5 w-5 shrink-0 items-center justify-center"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: icon }}
            />
        );
    }

    if (icon) {
        return (
            <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center">
                {icon}
            </span>
        );
    }

    return null;
}

/** Einzelner Menüeintrag mit stabiler Geometrie ohne Ruckler/Zucken und mit Cursor-Pointer */
function SidebarNavRow({
    item,
    collapsed,
    active,
}: {
    item: SidebarItem;
    collapsed: boolean;
    active: boolean;
}) {
    const content = (
        <>
            <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                {renderItemIcon(item.icon, item.svgIcon)}
            </span>
            <span
                className={`overflow-hidden whitespace-nowrap text-sm font-medium transition-[max-width,opacity] duration-300 ease-in-out ${
                    collapsed ? 'max-w-0 opacity-0 pointer-events-none' : 'max-w-40 opacity-100'
                }`}
            >
                {item.label}
            </span>
        </>
    );

    const baseClasses = `
        cursor-pointer group relative flex h-10 w-full items-center gap-3 rounded-xl px-2.5 text-sm font-medium
        outline-none transition-colors duration-150
        focus-visible:ring-2 focus-visible:ring-[var(--primary)]
        ${
            active
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm'
                : 'text-slate-600 hover:bg-[var(--muted)] hover:text-slate-900'
        }
    `;

    if (item.href) {
        return (
            <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                title={collapsed ? item.label : undefined}
                className={baseClasses}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            type="button"
            onClick={item.onClick}
            title={collapsed ? item.label : undefined}
            className={baseClasses}
        >
            {content}
        </button>
    );
}

export default function Sidebar({
    logo,
    title,
    subtitle,
    items,
    footerItems,
    footer,
    collapseLabel = 'Tabs',
    defaultCollapsed = false,
}: SidebarProps) {
    const pathname = usePathname();
    const navId = useId();
    const [collapsed, setCollapsed] = useState(defaultCollapsed);

    const isActive = (href?: string) => {
        if (!href) return false;
        if (pathname === href) return true;
        if (href === '/' || href === '/admin') return false;
        return pathname.startsWith(`${href}/`);
    };

    return (
        <div
            className={`relative flex shrink-0 flex-col transition-[width] duration-300 ease-in-out ${
                collapsed ? 'w-20' : 'w-64'
            }`}
        >
            {/*
             * Logo-Bereich auf dem Haupt-Hintergrund:
             * Exakt auf gleicher Höhe und Größe wie der Header (mt-4 h-14 mb-4),
             * sodass beide Spalten perfekt auf einer horizontalen Linie beginnen.
             */}
            <div className="mx-3 mt-4 mb-4 flex h-14 shrink-0 items-center px-3 gap-3">
                {logo && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center">{logo}</div>
                )}
                <div
                    className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-in-out ${
                        collapsed ? 'max-w-0 opacity-0 pointer-events-none' : 'max-w-40 opacity-100'
                    }`}
                >
                    {title && <p className="truncate text-sm font-bold text-slate-900">{title}</p>}
                    {subtitle && <p className="truncate text-xs text-slate-500">{subtitle}</p>}
                </div>
            </div>

            {/*
             * Hervorgehobene Tab-Menü-Fläche:
             * Fängt erst unterhalb der Header-Größe und mit dem Header-Abstand darunter an.
             * Gleiche Farbe & Schatten wie der Headbar (bg-white, shadow-md, ring-1).
             * Flüssiger Übergang des Border-Radius (rounded-3xl zu rounded-[28px]) ohne Zucken.
             */}
            <aside
                aria-labelledby={`${navId}-title`}
                className={`
                    mx-3 mb-4 flex flex-1 flex-col overflow-hidden
                    bg-(--card) shadow-md shadow-slate-900/10 ring-1 ring-[var(--border)]
                    transition-[border-radius] duration-300 ease-in-out
                    ${collapsed ? 'rounded-[28px]' : 'rounded-3xl'}
                `}
            >
                {/* Obere Leiste mit Text links und Button im eingeklappten Zustand exakt mittig */}
                <div className="flex h-10 w-full items-center mb-1 pt-1">
                    <div
                        className={`flex-1 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-in-out ${
                            collapsed
                                ? 'max-w-0 opacity-0 pointer-events-none'
                                : 'max-w-40 opacity-100 pl-3'
                        }`}
                    >
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
                            {collapseLabel}
                        </span>
                    </div>

                    <div
                        className={`flex items-center transition-all duration-300 ease-in-out ${
                            collapsed ? 'w-full justify-center' : 'shrink-0 pr-2'
                        }`}
                    >
                        <button
                            type="button"
                            aria-label={collapsed ? 'Sidebar aufklappen' : 'Sidebar einklappen'}
                            onClick={() => setCollapsed((c) => !c)}
                            className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-[var(--muted)] hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                        >
                            <svg
                                aria-hidden="true"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`transition-transform duration-300 ease-in-out ${
                                    collapsed ? 'rotate-180' : ''
                                }`}
                            >
                                <path d="M10 12L6 8l4-4" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Haupt-Navigation */}
                <nav
                    id={`${navId}-title`}
                    aria-label={title || 'Hauptnavigation'}
                    className="flex flex-1 flex-col gap-1 p-2 pt-0"
                >
                    {items.map((item) => (
                        <SidebarNavRow
                            key={item.href ?? item.label}
                            item={item}
                            collapsed={collapsed}
                            active={isActive(item.href)}
                        />
                    ))}
                </nav>

                {/* Footer-Bereich: SidebarItems (z.B. Ausloggen) und optionaler Footer-Inhalt */}
                {((footerItems && footerItems.length > 0) || footer) && (
                    <div className="mt-auto border-t border-[var(--border)] p-2">
                        {footerItems?.map((item) => (
                            <SidebarNavRow
                                key={item.href ?? item.label}
                                item={item}
                                collapsed={collapsed}
                                active={isActive(item.href)}
                            />
                        ))}

                        {footer && (
                            <div
                                className={`overflow-hidden whitespace-nowrap text-xs text-slate-400 transition-[max-width,opacity] duration-300 ease-in-out ${
                                    collapsed
                                        ? 'max-w-0 opacity-0 py-0'
                                        : 'max-w-[180px] opacity-100 px-2.5 py-2'
                                }`}
                            >
                                {footer}
                            </div>
                        )}
                    </div>
                )}
            </aside>
        </div>
    );
}
