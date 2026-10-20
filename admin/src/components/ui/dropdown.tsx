'use client';

import Link from 'next/link';
import { useRef, useEffect, useState, type ReactNode } from 'react';

export type DropdownItem = {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: ReactNode;
    divider?: boolean;
    danger?: boolean;
};

type DropdownProps = {
    trigger: ReactNode;
    items: DropdownItem[];
    align?: 'left' | 'right';
    className?: string;
};

export default function Dropdown({
    trigger,
    items,
    align = 'right',
    className = '',
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    return (
        <div ref={dropdownRef} className={`relative inline-block ${className}`}>
            {/* Klick öffnet/schließt das Menü */}
            <div
                role="button"
                tabIndex={0}
                aria-haspopup="true"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((prev) => !prev)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsOpen((prev) => !prev);
                    }
                }}
                className="cursor-pointer inline-flex items-center"
            >
                {trigger}
            </div>

            {/* Schwebendes Menü */}
            {isOpen && (
                <div
                    role="menu"
                    className={`
                        absolute top-full mt-2 min-w-[200px] z-50
                        overflow-hidden rounded-2xl bg-(--card) p-1.5
                        shadow-xl shadow-slate-900/10 ring-1 ring-[var(--border)]
                        ${align === 'right' ? 'right-0' : 'left-0'}
                    `}
                >
                    {items.map((item, idx) => {
                        if (
                            item.divider &&
                            !item.href &&
                            !item.onClick &&
                            item.label === 'trenner'
                        ) {
                            return <hr key={idx} className="my-1.5 border-[var(--border)]" />;
                        }

                        const itemContent = (
                            <>
                                {item.icon && (
                                    <span
                                        aria-hidden="true"
                                        className={`flex h-4 w-4 shrink-0 items-center justify-center ${
                                            item.danger
                                                ? 'text-[var(--destructive)]'
                                                : 'text-slate-400'
                                        }`}
                                    >
                                        {item.icon}
                                    </span>
                                )}
                                <span className="truncate">{item.label}</span>
                            </>
                        );

                        const itemClasses = `
                            cursor-pointer flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium
                            transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]
                            ${
                                item.danger
                                    ? 'text-[var(--destructive)] hover:bg-red-50 hover:text-red-700'
                                    : 'text-slate-700 hover:bg-[var(--muted)] hover:text-slate-900'
                            }
                        `;

                        return (
                            <div key={idx}>
                                {item.divider && <hr className="my-1.5 border-[var(--border)]" />}

                                {item.href ? (
                                    <Link
                                        href={item.href}
                                        role="menuitem"
                                        onClick={() => setIsOpen(false)}
                                        className={itemClasses}
                                    >
                                        {itemContent}
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        role="menuitem"
                                        onClick={() => {
                                            item.onClick?.();
                                            setIsOpen(false);
                                        }}
                                        className={itemClasses}
                                    >
                                        {itemContent}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
