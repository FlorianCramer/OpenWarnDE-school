# Arbeitsanweisungen für Coding Agents

## Verbindliche Projektgrundlage

OpenWarnDE 2.0 ist die Neukonzeption und prototypische Entwicklung einer Warn- und Lageinformationsplattform. Die fachlichen Soll-Anforderungen stehen in `_school/01_Projektantrag.md` und `_school/02_Analyse-Planung.md`.

Für technische Änderungen sind zusätzlich diese Dateien maßgeblich:

- [`docs/PRD.md`](docs/PRD.md) – Ziele, Anforderungen, MVP und Abnahmekriterien
- [`docs/Architecture.md`](docs/Architecture.md) – Zielarchitektur, Module und Schnittstellen
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) – UI-, Karten- und Interaktionsregeln

## Ziel des MVP

Der MVP muss eine strukturierte Client-Anwendung, interaktive Karte, Standortermittlung, Kartensuche, anpassbare Kartendarstellung, Verwaltungsoberfläche, Zugriffskonzept, manuelle Warnungserstellung und manuellen Push-Versand ermöglichen. Nicht ausdrücklich zum MVP gehörende Plattform-, Billing- und Microservice-Funktionen nicht vorzeitig ergänzen.

## Lokale Serveraufteilung

Während der Entwicklung müssen drei getrennte Server berücksichtigt werden:

- `localhost:3000`: öffentlicher Client
- `localhost:3001`: eigenständige Verwaltungs-UI als Webanwendung
- `localhost:8080`: eigenständiger API-/Backendserver

Die Admin-UI auf `3001` ist kein Backend. Sie darf nur über die API auf `8080` mit Daten und Verwaltungsfunktionen arbeiten. Auch der Client auf `3000` greift ausschließlich über die API auf Wetter-, Layer- und Warnungsdaten zu. Datenbankzugriffe, externe Quellen und API-Schlüssel gehören ausschließlich auf den Backendserver.

Nach Fertigstellung werden die drei Bestandteile für Firebase umgebaut. Lokale Portannahmen dürfen deshalb nicht fest in Fachlogik eingebaut werden; API-Basis-URL, erlaubte Origins und Firebase-Zieladressen müssen über Umgebungsvariablen konfiguriert werden.

## Zieltechnologien

- Next.js, React und TypeScript für Client und API-Grundlage
- MapLibre GL JS für die Ziel-Kartenengine
- Capacitor für die mobile Bereitstellung
- Firebase für geplante Hosting-/Daten- und ergänzende Dienste
- GitHub für Versionsverwaltung und CI/CD
- ESLint, TypeScript sowie automatisierte und manuelle Tests

Der aktuelle Code kann von diesem Zielbild abweichen. Abweichungen zunächst prüfen, dokumentieren und als Migrations- oder Entscheidungsaufgabe behandeln; nicht ungefragt eine große Migration durchführen.

## Arbeitsregeln

1. Vor der Umsetzung die betroffenen Anforderungen, Abnahmekriterien und offenen Entscheidungen aus `docs/` lesen.
2. Ist-Zustand und Soll-Zustand klar unterscheiden. Eine nicht vorhandene Funktion nicht als implementiert dokumentieren.
3. Die Architektur als modularen Monolithen mit fachlich getrennten Modulen weiterführen.
4. Client, Admin-UI und API als getrennte Prozesse und Verantwortlichkeiten behandeln; keine Backendlogik in die Admin-UI verschieben.
5. Neue Datenquellen serverseitig über Adapter, Validierung und Normalisierung integrieren; der Client soll keine Anbieterlogik enthalten.
6. API-Keys, interne URLs und andere Geheimnisse niemals an den Client oder in Logs geben.
7. Admin-Berechtigungen immer serverseitig prüfen. UI-Ausblendung ist keine Autorisierung.
8. Standort und Push nur mit dokumentierter Einwilligung, Datenschutzprüfung und verständlichem Fehlerzustand umsetzen.
9. Für Karten, Suche, Layer, Warnungen und Admin-Formulare jeweils Loading-, Empty-, Error- und Success-Zustände vorsehen.
10. MapLibre als Zieltechnologie beachten; vorhandene Leaflet-Implementierungen nur nach bewusster Migrationsentscheidung ersetzen.
11. Bestehende Komponenten wiederverwenden, wenn sie die Soll-Anforderungen erfüllen; unnötige Bibliotheken und großflächige Umbauten vermeiden.
12. Änderungen an API-Verträgen, Datenmodellen, Design-Tokens oder Architektur in den passenden Dokumenten nachführen.
13. Dateien welche nach einen umbau nicht mehr verwendet werden weil sie erstetzt wurden, sollen gelöscht werden.

## Sicherheitsregeln

- Keine Secrets aus `.env*`, Firebase-Konfigurationen oder API-Keys ausgeben.
- Keine produktiven Daten löschen oder überschreiben, wenn es nicht ausdrücklich beauftragt ist.
- Veröffentlichungs- und Push-Aktionen als besonders kritische Schreibvorgänge behandeln.
- Warnungen nicht als behördliche oder lebensrettende Echtzeitinformationen darstellen, solange das System ein Prototyp ist.
- Externe Dienste mit Timeout, Fehlerbehandlung und kontrolliertem Caching anbinden.

## Verifikation

Nach Codeänderungen von der Repository-Root aus möglichst ausführen:

```bash
npm run check
```

Bei Karten-, Standort-, Suche-, Warnungs- oder Push-Änderungen zusätzlich einen manuellen End-to-End-Test des betroffenen Ablaufs durchführen und das Ergebnis dokumentieren. Bei reinen Dokumentationsänderungen Pfade, Markdown-Struktur und Referenzen prüfen.

## Priorisierung bei Unklarheiten

1. Muss-Anforderung und Abnahmekriterium aus dem PRD.
2. Sicherheits- und Datenschutzanforderungen.
3. Architekturentscheidung für modularen Monolithen.
4. Bestehende Codekonventionen und Wiederverwendung.
5. Soll-Zieltechnologien und spätere Erweiterbarkeit.

Wenn eine konkrete Entscheidung fehlt, die Architektur oder Umfang wesentlich verändert, die Entscheidung als offene Aufgabe dokumentieren statt sie stillschweigend festzulegen.

## Darf nie getan werden

1. _schools darf nie bearbeitet werden von AI
2. npm run format
3. Nicht genutze Dateien existieren noch und sind nicht gelöscht.
