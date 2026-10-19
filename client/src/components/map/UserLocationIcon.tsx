export const USER_LOCATION_SVG_STRING = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="48"
  height="64"
  viewBox="0 0 48 64"
  role="img"
  aria-label="Standortfigur"
>
  <!-- Schatten auf der Karte -->
  <ellipse
    cx="24"
    cy="59"
    rx="10"
    ry="3"
    fill="#16354A"
    opacity="0.2"
  />

  <!-- Kopf: orangefarbener Kreis mit blauem Rand -->
  <circle
    cx="24"
    cy="15"
    r="12"
    fill="#FFFFFF"
    stroke="#006DAA"
    stroke-width="3"
  />

  <!-- Gesicht / Symbol -->
  <path
    d="M24 6 L32 21 L16 21 Z"
    fill="#F04B23"
    stroke="#F04B23"
    stroke-linejoin="round"
  />

  <!-- Körper -->
  <path
    d="M17 31
       Q24 34 31 31
       L30 48
       L18 48 Z"
    fill="#F04B23"
    stroke="#F04B23"
    stroke-width="2"
    stroke-linejoin="round"
  />

  <!-- Beine -->
  <path
    d="M21 48 L21 56
       M27 48 L27 56"
    fill="none"
    stroke="#F04B23"
    stroke-width="4"
    stroke-linecap="round"
  />

  <!-- Blaue Basis -->
  <path
    d="M12 58 Q24 54 36 58"
    fill="none"
    stroke="#006DAA"
    stroke-width="3"
    stroke-linecap="round"
  />
</svg>`;

export function UserLocationIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="64"
            viewBox="0 0 48 64"
            role="img"
            aria-label="Standortfigur"
            className={className}
        >
            {/* Schatten auf der Karte */}
            <ellipse cx="24" cy="59" rx="10" ry="3" fill="#16354A" opacity="0.2" />

            {/* Kopf: orangefarbener Kreis mit blauem Rand */}
            <circle cx="24" cy="15" r="12" fill="#FFFFFF" stroke="#006DAA" strokeWidth="3" />

            {/* Gesicht / Symbol */}
            <path
                d="M24 6 L32 21 L16 21 Z"
                fill="#F04B23"
                stroke="#F04B23"
                strokeLinejoin="round"
            />

            {/* Körper */}
            <path
                d="M17 31 Q24 34 31 31 L30 48 L18 48 Z"
                fill="#F04B23"
                stroke="#F04B23"
                strokeWidth="2"
                strokeLinejoin="round"
            />

            {/* Beine */}
            <path
                d="M21 48 L21 56 M27 48 L27 56"
                fill="none"
                stroke="#F04B23"
                strokeWidth="4"
                strokeLinecap="round"
            />

            {/* Blaue Basis */}
            <path
                d="M12 58 Q24 54 36 58"
                fill="none"
                stroke="#006DAA"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
}
