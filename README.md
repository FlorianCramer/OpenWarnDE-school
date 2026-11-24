<div align="center">

# OpenWarnDE 2.0

**Eine Warn- und Lageinformationsplattform auf einer interaktiven Karte.**

[![Status](https://img.shields.io/badge/Status-MVP%20in%20Entwicklung-FF5900?style=for-the-badge)](#)
[![Lizenz](https://img.shields.io/badge/Lizenz-MIT-007DCC?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

</div>

---

OpenWarnDE 2.0 ist die Neukonzeption und prototypische Entwicklung einer Warn- und Lageinformationsplattform als Schulprojekt (LF12, Vorbereitung auf die IHK-Abschlussprüfung). Auf einer interaktiven Karte werden Wetterdaten und Warnungen dargestellt, ergänzt durch Standort, Suche und eine Verwaltungsoberfläche für Administratoren.

> **Prototyp:** Dieses System ersetzt keine behördlichen Warn- oder Rettungsdienste.

## Funktionen

- Interaktive Karte (MapLibre GL JS)
- Standortermittlung nach Einwilligung
- Kartensuche
- Anpassbare Layer (Wetter, Radar, Warnungen)
- Verwaltungsoberfläche für Warnungen und Push-Nachrichten
- Nutzbar auf Web und mobil (Capacitor)

## Architektur

Das Projekt ist ein **modularer Monolith** mit drei getrennten Anwendungen:

| Anwendung       | Adresse          | Verantwortung                                           |
| --------------- | ---------------- | ------------------------------------------------------- |
| **Client**      | `localhost:3000` | Öffentliche Karte, Standort, Suche, Layer, Warnungen    |
| **Admin-UI**    | `localhost:3001` | Verwaltung: Warnungen bearbeiten, Push auslösen         |
| **API/Backend** | `localhost:8080` | Authentifizierung, Datenverarbeitung, Warnlogik, Wetter |

Client und Admin-UI sprechen ausschließlich über die API mit dem Backend. Datenbankzugriffe, externe Quellen und API-Schlüssel bleiben serverseitig.

## Projektstruktur

```text
OpenWarnDE-school/
├── client/    # Öffentliche Webanwendung
├── admin/     # Verwaltungs-UI
├── server/    # API-/Backend-Server
├── docs/      # PRD, Architektur, Design System
└── _school/   # Projektantrag, Analyse & Planung
```

## Entwicklung

Voraussetzung: Node.js installiert.

```bash
# Alle drei Server gleichzeitig starten
npm run dev
```

Einzeln starten:

```bash
npm run dev:app    # Client  → localhost:3000
npm run dev:admin  # Admin   → localhost:3001
npm run dev:srv    # Backend → localhost:8080
```

Qualitätsprüfung (Typecheck, Lint, Format):

```bash
npm run check
```

Nach Abschluss wird die Anwendung in eine **Firebase**-Zielumgebung überführt.

## Dokumentation

- [Produktanforderungen (PRD)](docs/PRD.md)
- [Architektur](docs/Architecture.md)
- [Design System](docs/DESIGN_SYSTEM.md)
- [Firebase](docs/FIREBASE.md)

## Lizenz

MIT – Florian Cramer
