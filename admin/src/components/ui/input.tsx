'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ className = '', ...props }, ref) => (
        <input
            ref={ref}
            {...props}
            className={`min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-[var(--foreground)] shadow-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 disabled:cursor-not-allowed disabled:bg-[var(--muted)] disabled:opacity-70 ${className}`}
        />
    ),
);

Input.displayName = 'Input';

export function InputField({
    label,
    hint,
    error,
    id,
    ...props
}: InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    hint?: string;
    error?: string;
}) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-sm font-medium text-[var(--foreground)]">
                {label}
            </label>
            <Input
                id={id}
                aria-invalid={Boolean(error)}
                aria-describedby={hint || error ? `${id}-help` : undefined}
                {...props}
            />
            {(hint || error) && (
                <p
                    id={`${id}-help`}
                    className={`text-xs ${error ? 'text-[var(--destructive)]' : 'text-[var(--muted-foreground)]'}`}
                >
                    {error || hint}
                </p>
            )}
        </div>
    );
}
