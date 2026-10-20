export type HeaderProps = {
    headline: string;
    subline:  string;
};

export function Header({ headline, subline }: HeaderProps) {
    return (
        <>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
                {headline}
            </h1>

            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {subline}
            </p>
        </>
    );
}
