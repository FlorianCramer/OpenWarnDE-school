# OpenWarnDE 2.0 – Product Requirements Document

**Grundlage:** `_school/01_Projektantrag.md` und `_school/02_Analyse-Planung.md`  
**Projektzeitraum:** 28.09.2026 bis 24.01.2027  
**Gesamtaufwand:** 80 Stunden

## 1. Projektziel

OpenWarnDE 2.0 ist die Neukonzeption und prototypische Entwicklung einer Warn- und Lageinformationsplattform. Ziel ist ein lauffähiger, getesteter und dokumentierter MVP, der als strukturierte technische Grundlage für die spätere Weiterentwicklung dient.

Der MVP soll:

- Informationen, Wetterdaten und mögliche Bevölkerungswarnungen übersichtlich auf einer Karte darstellen,
- den aktuellen Standort des Bürgers ermitteln und anzeigen,
- eine Suche innerhalb der Karte ermöglichen,
- die Kartendarstellung anpassbar machen,
- eine grundlegende Verwaltungsoberfläche bereitstellen,
- administrative Zugriffe kontrollieren,
- Warnungen manuell erstellen können,
- Push-Nachrichten manuell auslösen können.

Das Projekt ist ein eigenständiges Schul-, Lern- und Portfolio-Projekt. Es gibt keinen externen Auftraggeber und keinen Anspruch auf einen produktiven deutschlandweiten Leitstellenbetrieb.

## 1.1 Lokales Betriebsmodell

Während der Entwicklung wird die Anwendung in drei getrennten lokalen Servern betrieben:

| Adresse                 | Anwendung              | Verantwortung                                                                                              |
| ----------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| `http://localhost:3000` | Öffentlicher Client    | Kartenansicht, Standort, Suche, Layer und öffentliche Warninformationen.                                   |
| `http://localhost:3001` | Verwaltungs-UI         | Eigenständige Webanwendung für Administratoren; steuert das Backend über die API.                          |
| `http://localhost:8080` | OpenWarnDE API/Backend | Authentifizierung, Berechtigungen, Datenverarbeitung, Warnungen, Wetter, Konfiguration und Push-Steuerung. |

Die Verwaltungs-UI auf Port `3001` ist kein zweites Backend. Sie enthält keine eigene fachliche Datenhaltung und führt keine sicherheitskritischen Aktionen selbst aus. Alle Verwaltungsaktionen werden über den API-Server auf Port `8080` ausgeführt.

Bei Fertigstellung werden die drei lokalen Bestandteile in eine Firebase-Zielumgebung überführt. Die Trennung zwischen Client, Verwaltungs-UI und API bleibt erhalten; Hosting, Routing, Umgebungsvariablen und Datenhaltung werden dabei an Firebase angepasst.

## 2. Ausgangssituation und Problem

OpenWarnDEV besitzt bereits grundlegende Funktionen wie Kartenansicht, Standortermittlung und Nutzung auf verschiedenen Endgeräten. Die Anwendung ist jedoch gewachsen und nicht durchgehend auf eine einheitliche Architektur ausgerichtet. Dadurch sind Verantwortlichkeiten, Datenverarbeitung und Erweiterbarkeit nicht ausreichend klar getrennt.

OpenWarnDE 2.0 soll geeignete bestehende Bestandteile wiederverwenden, ungeeignete Ansätze überarbeiten und eine neue, modular erweiterbare Plattformstruktur schaffen.

## 3. Zielgruppen und Rollen

### 3.1 Bürger/Nutzer

Nutzer möchten schnell erkennen, ob an einem Ort relevante Wetter- oder Warninformationen vorliegen. Sie benötigen eine einfache Karte, Standortbezug, Suche und verständliche Darstellungen.

### 3.2 Administrator

Administratoren verwalten Warnungen, Datenquellen, Karteneinstellungen und den manuellen Versand von Push-Nachrichten. Ihre Rechte müssen serverseitig geprüft werden.

### 3.3 Entwickler/Projektbearbeiter

Entwickler benötigen eine verständliche Modulstruktur, versionierte Schnittstellen, reproduzierbare lokale Entwicklung und nachvollziehbare Tests.

## 4. Funktionale Anforderungen

| ID  | Anforderung                                                              | Priorität | Umsetzungsziel                                                                                    |
| --- | ------------------------------------------------------------------------ | --------- | ------------------------------------------------------------------------------------------------- |
| F01 | Die Anwendung stellt eine interaktive Karte dar.                         | Muss      | Zoomen, Verschieben und Bedienen der Karte sind möglich.                                          |
| F02 | Der aktuelle Standort des Nutzers kann ermittelt werden.                 | Muss      | Nach Einwilligung wird der Standort als Marker oder Kartenzentrum angezeigt.                      |
| F03 | Die Karte kann durchsucht werden.                                        | Muss      | Ein Ort oder eine Adresse kann gesucht und auf der Karte fokussiert werden.                       |
| F04 | Die Kartendarstellung kann angepasst werden.                             | Muss      | Nutzer können mindestens Basis-, Wetter- und verfügbare Warnlayer auswählen bzw. ein-/ausblenden. |
| F05 | Wetter- und Warninformationen werden räumlich dargestellt.               | Muss      | Daten werden als Layer, Marker, Fläche oder Detailansicht verständlich angezeigt.                 |
| F06 | Eine grundlegende Verwaltungsoberfläche ist vorhanden.                   | Muss      | Administratoren können relevante Konfigurationen und Warnungen bearbeiten.                        |
| F07 | Der Zugriff auf Verwaltungsfunktionen wird kontrolliert.                 | Muss      | Unberechtigte Nutzer können keine Admin-Aktionen ausführen.                                       |
| F08 | Warnungen können manuell erstellt werden.                                | Muss      | Eine Warnung enthält mindestens Titel, Text, Priorität, Gebiet und Status.                        |
| F09 | Push-Nachrichten können manuell ausgelöst werden.                        | Muss      | Ein Administrator kann eine freigegebene Warnung an den vorgesehenen Push-Dienst senden.          |
| F10 | Die Anwendung ist auf Web- und unterstützten mobilen Endgeräten nutzbar. | Soll      | Der Web-Client bleibt responsive und kann über Capacitor vorbereitet bzw. verpackt werden.        |
| F11 | Weitere Datenquellen können ergänzt werden.                              | Soll      | Neue Quellen werden serverseitig über Adapter und Konfiguration integriert.                       |
| F12 | Die API ist versioniert.                                                 | Soll      | Öffentliche Schnittstellen beginnen mit `/api/v1`; Breaking Changes erhalten eine neue Version.   |
| F13 | Weitere Betriebsmodi können später ergänzt werden.                       | Kann      | Warnungen, Wetter und zukünftige Domänen bleiben modular getrennt.                                |

## 5. Nichtfunktionale Anforderungen

| ID   | Anforderung                                                                                           |
| ---- | ----------------------------------------------------------------------------------------------------- |
| NF01 | Die Anwendung ist in mindestens drei fachlich getrennte Module gegliedert.                            |
| NF02 | Neue Datenquellen können ohne Änderung am Client ergänzt werden.                                      |
| NF03 | Administrative Berechtigungen werden serverseitig geprüft.                                            |
| NF04 | Die API verwendet ein einheitliches, versioniertes Antwort- und Fehlerformat.                         |
| NF05 | Die Anwendung ist auf unterstützten mobilen und webbasierten Endgeräten nutzbar.                      |
| NF06 | Der Quellcode ist nachvollziehbar strukturiert und die wesentlichen Entscheidungen sind dokumentiert. |
| NF07 | Die Lösung wird durch automatisierte und manuelle Tests abgesichert.                                  |
| NF08 | Externe Datenquellen sind austauschbar und erweiterbar.                                               |
| NF09 | Geheimnisse und API-Schlüssel werden nicht an den Client ausgeliefert.                                |
| NF10 | Standort- und Push-Funktionen berücksichtigen Einwilligung und Datenschutz.                           |

## 6. MVP-Abgrenzung

### 6.1 Im MVP enthalten

- strukturierter Client,
- interaktive Karte,
- Standortermittlung und Standortanzeige,
- Kartensuche,
- Anpassung der Kartendarstellung,
- grundlegende Verwaltungsoberfläche,
- grundlegendes Zugriffskonzept,
- manuelle Warnungserstellung,
- manueller Push-Versand,
- automatisierte und manuelle Qualitätssicherung,
- technische Entwickler- und Endnutzerdokumentation.

### 6.2 Nicht im MVP enthalten

- vollständige Developer Platform,
- Billing- und Tarifmodell,
- vollständige Verwaltung externer API-Kunden,
- produktiver deutschlandweiter Betrieb,
- vollständig automatische Risikobewertung aller Datenquellen,
- vollständige Microservice-Infrastruktur.

## 7. Ziel-API

Die konkrete Umsetzung kann angepasst werden, soll aber mindestens folgende fachliche Schnittstellen vorsehen. Während der lokalen Entwicklung werden sie vom API-Server auf Port `8080` bereitgestellt:

| Route                                      | Zweck                                                |
| ------------------------------------------ | ---------------------------------------------------- |
| `GET /api/v1/layers`                       | Verfügbare Karten-, Wetter- und Warnlayer liefern.   |
| `GET /api/v1/warnings`                     | Öffentliche, aktive Warnungen liefern.               |
| `POST /api/v1/admin/warnings`              | Warnung nach Berechtigungsprüfung erstellen.         |
| `POST /api/v1/admin/warnings/{id}/publish` | Warnung veröffentlichen und optional Push auslösen.  |
| `GET /api/v1/location/search`              | Kartensuche an einen geeigneten Suchdienst anbinden. |
| `GET /api/v1/weather/...`                  | Wetterdaten und Wetterkacheln bereitstellen.         |

Interne Admin-Routen dürfen nicht allein durch die Client-Oberfläche geschützt werden. Jede schreibende Aktion benötigt serverseitige Authentifizierung und Autorisierung.

Der Client auf `3000` und die Verwaltungs-UI auf `3001` beziehen fachliche Daten ausschließlich über `http://localhost:8080/api/v1/...` beziehungsweise definierte Admin-API-Routen. Direkte Datenbankverbindungen der UIs sind nicht vorgesehen.

## 8. Abnahmekriterien

Der MVP gilt als erfolgreich, wenn:

- die Anwendung gestartet und verwendet werden kann,
- die Karte korrekt dargestellt und bedient werden kann,
- der eigene Standort nach Einwilligung ermittelt und angezeigt wird,
- eine Kartensuche funktioniert,
- Kartendarstellungen und Layer angepasst werden können,
- die Verwaltungsoberfläche erreichbar und geschützt ist,
- eine Warnung manuell angelegt werden kann,
- eine Warnung manuell veröffentlicht bzw. ein Push-Versand ausgelöst werden kann,
- relevante Funktionen automatisiert und manuell getestet wurden,
- bekannte Fehler dokumentiert oder behoben wurden,
- die Architektur eine spätere Erweiterung um weitere Datenquellen und Betriebsmodi ermöglicht.

## 9. Projekt- und Zeitrahmen

| Phase                                            |  Aufwand |
| ------------------------------------------------ | -------: |
| Analyse des bestehenden Systems                  |      8 h |
| Anforderungsanalyse und Projektplanung           |      8 h |
| Soll-Konzept und Architekturplanung              |      8 h |
| Variantenvergleich und Technologieentscheidungen |      6 h |
| Technische Projektgrundlage                      |      6 h |
| MVP-Implementierung                              |     22 h |
| Qualitätssicherung und Tests                     |      6 h |
| Abnahme und Fehlerkorrekturen                    |      4 h |
| Projektdokumentation                             |     12 h |
| **Gesamt**                                       | **80 h** |

## 10. Wirtschaftlicher und fachlicher Nutzen

Der Nutzen liegt nicht in unmittelbaren Einnahmen, sondern in einer strukturierten und erweiterbaren technischen Grundlage. Klare Anforderungen, wiederverwendbare Komponenten, modulare Architektur und Tests reduzieren zukünftigen Entwicklungs- und Wartungsaufwand. Zusätzlich vertieft das Projekt die Kenntnisse des Projektbearbeiters und dient als Referenzprojekt.

## 11. Anpassungsfelder vor der Umsetzung

Vor Beginn eines Umsetzungsschritts sind insbesondere diese Punkte zu konkretisieren:

- konkreter Push-Dienst und dessen Authentifizierung,
- Rollen und Rechte des Zugriffskonzepts,
- Suchdienst und Datenschutz der Suchanfragen,
- Warnungsmodell und zulässige Gebietsformen,
- konkrete externe Warn- und Wetterquellen,
- Definition der mobilen Zielplattformen,
- verbindliche Abnahme- und Testfälle.
