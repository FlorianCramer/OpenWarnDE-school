# OpenWarnDE 2.0 – Design System

## 1. Designziel

OpenWarnDE soll ruhig, einfach verständlich, vertrauenswürdig und barrierearm wirken. Die Oberfläche priorisiert die Karte und wichtige Warninformationen. Nutzer müssen schnell erkennen können, wo sich ihr Standort befindet, welche Wetter- oder Warnlage gilt und welche Aktion möglich ist.

Das Design ist für Desktop, Tablet, mobile Browser und eine spätere Capacitor-App geeignet. Funktionale Klarheit hat Vorrang vor dekorativen Effekten.

Die öffentliche Anwendung läuft lokal auf `http://localhost:3000`. Die getrennte Verwaltungsoberfläche läuft lokal auf `http://localhost:3001` und kommuniziert ausschließlich mit dem Backend auf `http://localhost:8080`. Die Admin-Oberfläche ist kein Bestandteil des öffentlichen Clients.

## 2. Nutzerorientierte Leitlinien

- **Karte zuerst:** Die Karte ist die zentrale Arbeitsfläche und bleibt möglichst gut sichtbar.
- **Ruhige Oberfläche:** Wenige Farben, klare Abstände, zurückhaltende Rahmen und sparsame Schatten. Unnötige Animationen, visuelle Effekte und dekorative Elemente werden vermieden.
- **Warnungen eindeutig:** Priorität und Status werden immer durch Text und nicht nur durch Farbe kommuniziert.
- **Kontext sichtbar:** Quelle, Aktualität und Gültigkeitszeitraum werden bei Wetter- und Warninformationen angezeigt.
- **Sicher handeln:** Das Erstellen und Veröffentlichen von Warnungen wird getrennt; kritische Aktionen benötigen eine explizite Bestätigung.
- **Mobile First:** Die Gestaltung wird zuerst für kleine Displays mitgedacht. Controls sind touch-tauglich und dürfen wichtige Kartenbereiche nicht unnötig verdecken.
- **Barrierefreiheit als Pflicht:** Tastaturbedienung, sichtbarer Fokus, ausreichender Kontrast, Screenreader-Unterstützung und verständliche Fehlertexte sind verbindlich.
- **Einheitliches UI:** Client und Admin verwenden dieselbe visuelle Sprache, dieselben Designprinzipien und konsistente UI-Komponenten, soweit die jeweiligen Anwendungsfälle dies erlauben.
- **Offline-Fähigkeit:** Grundlegende UI-Elemente und benötigte statische Ressourcen werden lokal bereitgestellt und benötigen keine externen UI-CDNs.

## 3. Visuelle Grundlagen

### 3.1 Farben und Design-Tokens

Die primäre Designfarbe ist ein gut lesbarer Blauton. Hintergründe sind überwiegend hell und weiß beziehungsweise leicht gebrochen weiß. Das UI soll freundlich, ruhig und sachlich wirken.

Die Basisfarben werden als semantische Tokens definiert. Im Client werden sie in `client/src/app/globals.css` geführt. Für die Admin-Oberfläche sind dieselben semantischen Werte zu übernehmen oder über eine gemeinsame Token-Quelle konsistent abzubilden.

| Token                  | Zweck                                                         |
| ---------------------- | ------------------------------------------------------------- |
| `--background`         | Heller Seiten- und Panelhintergrund                           |
| `--foreground`         | Primärtext mit ausreichendem Kontrast                         |
| `--primary`            | Primäre Aktion, aktive Auswahl und Fokusakzent                |
| `--primary-foreground` | Text und Icons auf primären Flächen                           |
| `--border`             | Dezente Rahmen und Trennlinien                                |
| `--muted`              | Zurückhaltende Sekundärflächen                                |
| `--muted-foreground`   | Sekundärtexte und ergänzende Informationen                    |
| `--card`               | Hintergrund von Karten und Panels                             |
| `--destructive`        | Destruktive Aktionen und kritische Fehlersituationen          |
| `--success`            | Erfolgszustände, immer zusätzlich textlich gekennzeichnet     |
| `--warning`            | Allgemeine Warnhinweise außerhalb der fachlichen Radarlegende |

**Farbregeln:**

- Blau ist die primäre UI-Farbe und wird für primäre Aktionen, aktive Zustände und ausgewählte Elemente verwendet.
- Der Hintergrund ist weiß oder ein sehr heller neutraler Farbton.
- Flächen, Rahmen und Schatten bleiben dezent. Starke Verläufe, übermäßige Schatten und unnötig bunte Oberflächen werden vermieden.
- Rot ist für hohe Dringlichkeit, Fehler mit Handlungsbedarf und destruktive Aktionen reserviert.
- Wetter- und Radarfarben werden ausschließlich nach der fachlichen Wetterlegende in Abschnitt 4 vergeben. Sie dürfen nicht durch die allgemeinen UI-Farben ersetzt werden.
- Farbe darf niemals die einzige Informationsträgerin sein. Status und Bedeutung müssen zusätzlich durch Text, Icon, Muster oder andere eindeutige Kennzeichnungen vermittelt werden.
- Farbkontraste müssen die Barrierefreiheitsanforderungen aus Abschnitt 5 erfüllen.

### 3.2 Typografie

- Systemschriftstack für eine schnelle und plattformnahe Darstellung.
- Externe Schriftanbieter sind nicht erforderlich; verwendete Schriftdateien werden lokal bereitgestellt.
- Seitentitel sind kurz und eindeutig.
- Bereichstitel besitzen eine klare Hierarchie und können semibold dargestellt werden.
- Warnungstitel sind gut lesbar und werden nicht ausschließlich in Versalien dargestellt.
- Technische Werte, IDs und URLs können Monospace verwenden.
- Zeitangaben enthalten ein eindeutiges Datum und eine nachvollziehbare Uhrzeit.
- Texte müssen bei Browser-Zoom und vergrößerter Schrift lesbar bleiben. Inhalte dürfen nicht abgeschnitten werden oder ihre Funktion verlieren.

### 3.3 Abstände, Flächen und Formgebung

- Basiseinheit: 4 px; bevorzugte Abstände sind 8, 12, 16, 24 und 32 px.
- Interaktive Touch-Ziele sind nach Möglichkeit mindestens 44 × 44 px groß.
- Panels und Cards verwenden einen zurückhaltenden Radius von etwa 8–12 px.
- Rahmen sind dezent und konsistent.
- Schatten werden sparsam eingesetzt und dienen nur der räumlichen Orientierung.
- Overlay-Flächen besitzen einen ausreichend deckenden Hintergrund.
- Abstände und Ausrichtung sind über Client und Admin konsistent.
- Informationen werden in übersichtlichen Gruppen angeordnet. Dichte Informationsblöcke und unnötig verschachtelte Panels sind zu vermeiden.

## 4. Wetter- und Radarlegende

Die Radarlegende ist eine fachliche Darstellung der Radarreflektivität und der daraus grob abgeleiteten Niederschlagsintensität. Sie wird in der Kartenlegende und in allen passenden Wetteransichten konsistent verwendet.

**Wichtiger fachlicher Hinweis:** dBZ beschreibt Radarreflektivität und ist keine direkte Messung der Niederschlagsmenge am Boden. Die Zuordnung zu mm/h ist nur eine Näherung und hängt unter anderem von Niederschlagsart, Radar, Auswerteverfahren und lokalen Bedingungen ab. Überlappende dBZ-Bereiche in der Legende sind als ungefähre Orientierungsbereiche zu verstehen, nicht als scharf getrennte Grenzen.

### 4.1 Radarreflektivität und Beschreibung

| Farbe           | Radarwert / ungefährer Bereich | Niederschlagsintensität | Beschreibung                                                                                     |
| --------------- | -----------------------------: | ----------------------- | ------------------------------------------------------------------------------------------------ |
| 🩵 **Hellblau** |                   ca. 1–15 dBZ | Sehr gering             | Kein oder nur geringer Niederschlag; häufig Sprühregen bzw. einzelne Tropfen                     |
| 🟢 **Grün**     |                  ca. 15–25 dBZ | Leicht                  | Leichter Niederschlag, z. B. leichter Landregen                                                  |
| 🟩 **Hellgrün** |                  ca. 25–30 dBZ | Leicht bis mäßig        | Leichter bis mäßiger Regen                                                                       |
| 🟡 **Gelb**     |                  ca. 30–35 dBZ | Mäßig                   | Mäßiger bis zunehmend kräftiger Niederschlag                                                     |
| 🟠 **Orange**   |               ca. 35–40/45 dBZ | Stark                   | Kräftiger Niederschlag bzw. stärkere Schauer                                                     |
| 🔴 **Rot**      |                  ca. 45–55 dBZ | Sehr stark              | Sehr starker Regen; häufig kräftige Schauer oder Gewitter, deutlich erhöhtes Starkregenpotenzial |
| 🟣 **Lila**     |                 ca. 50–55+ dBZ | Extrem                  | Sehr intensive Schauer/Gewitter; Starkregen und ggf. Hagel möglich                               |
| 🔵 **Blau**     |                        >55 dBZ | Extrem                  | Extrem hohe Radarreflektivität; häufig Hinweis auf sehr starke Gewitter und insbesondere Hagel   |

### 4.2 Ungefähre Niederschlagsintensität

| Farbe       | Ungefährer Niederschlag |
| ----------- | ----------------------: |
| 🩵 Hellblau |              < 0,4 mm/h |
| 🟢 Grün     |        ca. 0,4–1,5 mm/h |
| 🟩 Hellgrün |          ca. 1,5–3 mm/h |
| 🟡 Gelb     |            ca. 3–8 mm/h |
| 🟠 Orange   |           ca. 8–20 mm/h |
| 🔴 Rot      |         ca. 20–50+ mm/h |
| 🟣 Lila     |        ca. 50–100+ mm/h |
| 🔵 Blau     |       >100 mm/h möglich |

### 4.3 Darstellung und Bedienung der Wetterlegende

- Die Legende zeigt Farbe, Bezeichnung und fachlichen Wertebereich gemeinsam an.
- Die Farbbedeutung darf nicht allein durch Farberkennung verständlich sein. Jede Stufe erhält eine Textbezeichnung und einen Wertebereich.
- Die Legende muss auf Mobilgeräten ohne horizontales Scrollen lesbar sein. Bei wenig Platz darf sie als aufklappbarer Bereich oder kompakte, gut bedienbare Legende dargestellt werden.
- Die Reihenfolge und Benennung der Stufen bleiben in Karte, Layer-Auswahl und Wetterdetails konsistent.
- Wetterfarben bleiben von Warnstufenfarben und den allgemeinen UI-Design-Tokens getrennt.
- Quelle, Zeitstempel und Aktualität der dargestellten Radardaten werden angezeigt, sofern diese Informationen verfügbar sind.
- Die Anwendung darf aus der Radarfarbe allein keine garantierte Aussage über die tatsächlich am Boden gemessene Niederschlagsmenge oder über Hagel ableiten.

## 5. Barrierefreiheit und inklusive Bedienung

Barrierefreiheit ist eine verbindliche Anforderung für Client und Admin. Die Oberfläche soll von Menschen mit unterschiedlichen Seh-, Hör-, Bewegungs- und kognitiven Voraussetzungen bedient werden können.

### 5.1 Kontrast und Wahrnehmbarkeit

- Text und Bedienelemente müssen ausreichende Kontraste besitzen.
- Als Mindestziel gelten WCAG-konforme Kontraste: 4,5:1 für normalen Text und 3:1 für großen Text sowie relevante grafische Bedienelemente.
- Zustände werden nie ausschließlich über Farbe vermittelt.
- Fokus, Auswahl, Fehler und Deaktivierung müssen auch ohne Farbwahrnehmung unterscheidbar sein.
- Icons mit funktionaler Bedeutung erhalten eine zugängliche Beschriftung oder einen geeigneten zugänglichen Namen.

### 5.2 Tastatur und Screenreader

- Alle Funktionen müssen ohne Maus per Tastatur bedienbar sein.
- Der Tastaturfokus ist jederzeit klar sichtbar und wird nicht durch Panels oder Overlays verdeckt.
- Die Fokusreihenfolge entspricht der visuellen und fachlichen Reihenfolge.
- Formularelemente besitzen programmatisch zugeordnete Labels.
- Fehler werden dem betroffenen Feld zugeordnet und verständlich beschrieben.
- Dynamische Statusmeldungen, beispielsweise Ladeabschluss oder Versandresultate, werden für assistive Technologien geeignet ausgegeben.
- Dialoge verwalten den Fokus korrekt, schließen sich mit einer erwartbaren Tastaturbedienung und geben den Fokus nach dem Schließen an das auslösende Element zurück.
- Semantisches HTML hat Vorrang. ARIA wird ergänzend und nur dann eingesetzt, wenn native Semantik nicht ausreicht.

### 5.3 Verständlichkeit und kognitive Zugänglichkeit

- Kurze, eindeutige Beschriftungen und verständliche Fehlermeldungen verwenden.
- Fachbegriffe werden bei Bedarf erklärt.
- Aktionen mit weitreichenden Folgen werden klar benannt und vor der Ausführung bestätigt.
- Fehlermeldungen beschreiben das Problem und, soweit möglich, den nächsten sinnvollen Schritt.
- Keine unnötigen Animationen oder blinkenden Elemente. Bewegungen sind zu reduzieren, wenn das Betriebssystem eine entsprechende Präferenz meldet.
- Zeitkritische Inhalte müssen klar zwischen Beginn, Ende, Aktualität und möglicher Verzögerung unterscheiden.

### 5.4 Karte und alternative Informationsdarstellung

- Die Karte darf nicht die einzige Möglichkeit sein, Wetter- und Warninformationen zu verstehen.
- Warnungen und relevante Karteninformationen werden ergänzend in einer strukturierten Liste oder Detailansicht angeboten.
- Kartenbedienelemente erhalten verständliche zugängliche Namen.
- Wichtige Informationen dürfen nicht ausschließlich durch Position, Farbe oder Symbole vermittelt werden.
- Die Kartenbedienung muss auch auf kleinen Displays und bei vergrößerter Darstellung nutzbar bleiben.

## 6. Kernkomponenten

### 6.1 Karte

Die Karte verwendet im Zielbild MapLibre GL JS. Sie zeigt Basisdaten, Wetter, Warnungen und den eigenen Standort. Layer erhalten verständliche Namen, Attribution und eine Legende.

Der Kartenstatus muss `loading`, `ready`, `empty` und `error` unterscheiden. Bei fehlender Netzwerkverbindung wird ein nachvollziehbarer Zustand angezeigt. Bereits lokal verfügbare Informationen sollen weiterhin erreichbar bleiben, sofern dies technisch unterstützt wird.

### 6.2 Standort

Die Standortaktion ist als klar beschrifteter Button sichtbar. Vor der Ermittlung wird die Einwilligung des Browsers bzw. Betriebssystems respektiert. Bei Ablehnung oder Fehler wird eine verständliche Rückmeldung angezeigt; die Karte bleibt nutzbar.

### 6.3 Suche

Die Suche bietet ein Eingabefeld mit sichtbarem Label, Ladezustand, Ergebnisliste und leerem Zustand. Ein Treffer fokussiert die Karte und zeigt den gefundenen Ort. Suchanbieter und Datenschutz werden in der Oberfläche nachvollziehbar angegeben. Ist die Suche netzwerkabhängig, wird dies bei Offline-Zustand klar kommuniziert.

### 6.4 Layer-Auswahl

Layer werden als Radio, Checkbox oder vergleichbares Control dargestellt. Der aktive Zustand ist eindeutig. Wetter- und Warnlayer zeigen Quelle, Aktualität und Legende.

### 6.5 Warnkarte

Eine Warnkarte enthält mindestens Titel, Priorität, Kurzbeschreibung, Gebiet, Beginn, Ende und Quelle. Die Reihenfolge ist: Dringlichkeit, Handlungshinweis, Details, Quelle/Aktualität. Dringlichkeit und Status sind textlich erkennbar und nicht allein von der Farbe abhängig.

### 6.6 Admin-Formular

Admin-Formulare gruppieren Datenquelle, Warnungsinhalt, Gebiet, Veröffentlichung und Push-Versand. Validierungsfehler stehen am Feld und zusätzlich in einer zusammenfassenden Meldung. „Speichern“ und „Veröffentlichen“ sind getrennte Aktionen.

Die Admin-UI ist eine eigenständige Webanwendung. Sie hält keine eigene fachliche Datenquelle vor, sondern zeigt den vom API-Server gelieferten Zustand an. Nach dem Speichern wird der Zustand erneut über die API geladen.

### 6.7 Push-Versand

Der Versand wird als explizite, bestätigungspflichtige Aktion gestaltet. Vor dem Versand wird zusammengefasst, welche Warnung und welche Empfängergruppe betroffen sind. Erfolg, Teilerfolg und Fehler werden textlich ausgegeben. Bei fehlender Verbindung darf kein erfolgreicher Versand vorgetäuscht werden.

## 7. Zustände

Jede datenabhängige Komponente definiert die Zustände `loading`, `success`, `empty`, `error` und `disabled`, soweit diese für die Komponente sinnvoll sind.

- Zustände werden nicht ausschließlich über Farbe vermittelt.
- Ladezustände blockieren die Oberfläche nicht länger als notwendig.
- Leere Zustände erklären, warum keine Inhalte angezeigt werden oder welche Aktion möglich ist.
- Fehlerzustände verwenden verständliche Sprache und bieten, sofern sinnvoll, eine Wiederholungsaktion.
- Bei Offline-Zuständen wird zwischen fehlender Verbindung, lokal verfügbaren Daten und möglicherweise veralteten Daten unterschieden.

## 8. Responsive Regeln und Mobile First

- **Mobil:** Die Oberfläche wird zuerst für kleine Displays konzipiert. Wichtige Controls erscheinen als kompakte Leiste oder Bottom Sheet; Warnungsdetails erhalten eine priorisierte Ansicht.
- **Tablet:** Panels können schmaler oder einklappbar werden.
- **Desktop:** Karte mit seitlichen oder schwebenden Panels.
- Horizontales Scrollen wird vermieden, außer bei ausdrücklich technischen Tabellen im Adminbereich. Tabellen müssen auf Mobilgeräten eine geeignete alternative Darstellung oder kontrolliertes Scrollen erhalten.
- Bedienelemente sind für Maus, Tastatur und Touch ausgelegt.
- Touch-Ziele sind nach Möglichkeit mindestens 44 × 44 px groß.
- Die Karte bleibt auf kleinen Displays sinnvoll nutzbar. Panels und Dialoge dürfen wichtige Kartenbereiche nicht unnötig verdecken.
- Inhalte bleiben bei Browser-Zoom und vergrößerter Schrift verfügbar.
- Responsive Layouts werden für Client und Admin getrennt getestet.

## 9. Tailwind CSS und lokale UI-Komponenten

### 9.1 Tailwind CSS

Tailwind CSS ist das verbindliche CSS-Utility-Framework für Client und Admin.

- Neue Layouts und UI-Komponenten verwenden Tailwind CSS.
- Wiederkehrende Gestaltung wird über gemeinsame Design-Tokens, Tailwind-Konfiguration und lokale Komponenten vereinheitlicht.
- Globale CSS-Dateien enthalten primär Design-Tokens, Basisregeln und notwendige globale Anpassungen.
- Einzelne Komponenten sollen keine voneinander abweichenden, hart codierten Farb-, Abstands- oder Radiuswerte einführen, wenn passende Tokens vorhanden sind.
- Tailwind-Klassen werden konsistent und wartbar eingesetzt. Für komplexe oder wiederverwendete Varianten sind lokale Varianten- beziehungsweise Hilfsfunktionen zulässig.
- Vorhandene Framework- und Build-Konfigurationen werden berücksichtigt; Client und Admin müssen Tailwind jeweils korrekt in ihren Build-Prozess integrieren.

### 9.2 Grundprinzip lokaler UI-Komponenten

Sowohl die Client-UI als auch die Server-/Admin-UI besitzen einen eigenen `src/components/ui/`-Ordner. Dort liegen die generischen, wiederverwendbaren UI-Basiskomponenten.

Alle grundlegenden UI-Elemente werden lokal im Repository implementiert oder als zulässig übernommener Quellcode versioniert. Die Anwendung darf nicht darauf angewiesen sein, zur Laufzeit UI-Komponenten von externen Anbietern zu laden.

**Verbindliche Regeln:**

- Keine UI-Komponenten, Stylesheets, Skripte, Icons oder Schriftdateien für die grundlegende Oberfläche von externen CDNs nachladen.
- UI-Komponenten werden lokal gepflegt und gemeinsam mit der Anwendung versioniert.
- Komponenten folgen einer einheitlichen visuellen Sprache und verwenden dieselben semantischen Design-Tokens, soweit die jeweiligen Frameworks dies ermöglichen.
- Drittanbieter-Bibliotheken dürfen als Entwicklungsgrundlage dienen, sofern Lizenz und Nutzungsbedingungen die lokale Übernahme erlauben. Die tatsächlich verwendeten UI-Komponenten müssen im Projekt lokal verfügbar sein.
- Lizenzbedingungen und erforderliche Copyright-Hinweise werden eingehalten.
- Externe Datenquellen, APIs und Kartendienste sind von UI-Komponenten zu unterscheiden. Sie können weiterhin Netzwerkzugriff benötigen und müssen separat behandelt werden.

### 9.3 Zielstruktur

Die folgende Struktur ist ein Zielbild und an die tatsächlichen Projektverzeichnisse anzupassen:

```text
OpenWarnDE/
├── server/                    # Backend/API, sofern hier vorhanden
├── client/
│   └── src/
│       ├── app/
│       └── components/
│           ├── ui/
│           │   ├── button
│           │   ├── input
│           │   ├── textarea
│           │   ├── checkbox
│           │   ├── radio-group
│           │   ├── select
│           │   ├── switch
│           │   ├── dialog
│           │   ├── dropdown-menu
│           │   ├── tooltip
│           │   ├── card
│           │   ├── badge
│           │   ├── alert
│           │   ├── separator
│           │   ├── skeleton
│           │   └── spinner
│           └── ...             # Fachliche Client-Komponenten
├── admin/                     # Eigenständige Admin-Anwendung, falls so benannt
│   └── src/
│       └── components/
│           ├── ui/             # Lokale UI-Basiskomponenten der Admin-UI
│           └── ...             # Fachliche Admin-Komponenten
└── design_system.md
```

Der Ordner `server/src/components/ui/` ist nur dann erforderlich, wenn tatsächlich eine serverseitig gerenderte UI existiert. Bei einer getrennten Web-Administration gehört der UI-Ordner in das Verzeichnis dieser Admin-Anwendung. Reine API-/Backend-Services benötigen keine UI-Komponenten.

### 9.4 Umfang der UI-Basiskomponenten

Der Ordner `components/ui/` enthält generische, wiederverwendbare UI-Bausteine, insbesondere:

- **Formularelemente:** Button, Input, Textarea, Checkbox, Radio Group, Select und Switch.
- **Strukturelemente:** Card, Separator, Tabs und Accordion.
- **Feedbackelemente:** Alert, Badge, Toast, Spinner und Skeleton.
- **Overlayelemente:** Dialog, Popover, Dropdown Menu und Tooltip.
- **Navigationselemente:** Breadcrumbs und Pagination, sofern sie im jeweiligen Anwendungsteil benötigt werden.

Fachliche Komponenten wie `WarningCard`, `MapView`, `LocationControl`, `SearchControl`, `AdminWarningForm` und `PushAction` liegen außerhalb von `components/ui/`. Sie verwenden die lokalen UI-Basiskomponenten, statt allgemeine Bedienelemente unnötig zu duplizieren.

### 9.5 Einheitliche Komponenten und Tokens

- Client und Admin verwenden dieselbe visuelle Sprache, dieselben Farbdefinitionen und konsistente Interaktionsmuster.
- Gemeinsame Tokens werden zentral dokumentiert und in beiden Anwendungen konsistent abgebildet.
- Komponenten dürfen anwendungsspezifische Varianten besitzen, sofern die Bedienung und visuelle Sprache konsistent bleiben.
- Bestehende Komponenten werden vor dem Erstellen neuer Komponenten geprüft.
- Fachliche und generische Komponenten werden klar voneinander getrennt.

## 10. Offline-Fähigkeit

Lokale UI-Komponenten sind eine Voraussetzung für die Offline-Fähigkeit der Benutzeroberfläche, garantieren allein aber noch keine vollständige Offline-Funktionalität.

- Grundlegende UI-Elemente funktionieren ohne Verbindung zu externen UI-CDNs oder Komponentenservern.
- Bereits ausgelieferte Anwendungsteile benötigen für ihre grundlegende Darstellung keine externe Verbindung.
- CSS, JavaScript, Icons und benötigte Schriftdateien werden lokal ausgeliefert.
- Für den Client sind, sofern die Anwendung als installierbare Web-App betrieben wird, geeignete Cache- und Service-Worker-Strategien vorzusehen.
- Netzwerkabhängige Funktionen, beispielsweise aktuelle Warnungen, Wetterdaten, Geocoding oder externe Kartendaten, zeigen einen nachvollziehbaren Offline-Zustand.
- Die Oberfläche unterscheidet zwischen lokal verfügbaren Informationen, veralteten Daten und aktuell nicht erreichbaren Datenquellen.
- Kritische Aktionen, insbesondere Warnungsveröffentlichung und Push-Versand, werden bei fehlender Verbindung blockiert oder nach einem ausdrücklich definierten fachlichen Offline-Verfahren behandelt.
- Offline-Verfügbarkeit und Aktualität fachlicher Daten werden getrennt von der Offline-Verfügbarkeit der UI bewertet.

## 11. Technische Regeln und Qualitätssicherung

- Bestehende Design-Tokens wiederverwenden und neue Tokens semantisch benennen.
- Warn- und Wetterfarben nicht an mehreren Stellen unabhängig definieren.
- Kartendaten und fachliche Legenden aus API-Modellen beziehen, soweit sie fachlich vom Backend geliefert werden.
- Keine sicherheitskritische Funktion nur durch visuelles Verbergen schützen.
- Fachliche Komponenten nach Verantwortung trennen, zum Beispiel `MapView`, `LocationControl`, `SearchControl`, `WarningCard`, `AdminWarningForm` und `PushAction`.
- Tailwind CSS in Client und Admin konsistent verwenden.
- Lokale UI-Komponenten müssen Tastaturbedienung, Fokusdarstellung, verständliche Statusmeldungen und responsive Darstellung unterstützen.
- Automatisierte Prüfungen sollen externe Laufzeitimporte für grundlegende UI-Komponenten erkennen.
- Die Offline-Prüfung muss mindestens die Darstellung der Anwendung ohne externe UI-Ressourcen abdecken.
- Client und Admin werden auf kleinen und großen Displays sowie mit Tastaturbedienung getestet.
- Änderungen an der visuellen Sprache werden in dieser Datei und bei Bedarf in den API-/Fachdokumenten nachgeführt.
