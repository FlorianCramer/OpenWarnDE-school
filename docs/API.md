# OpenWarnDE API

Die lokale API läuft auf `http://localhost:8080`. Die maschinenlesbare Dokumentation ist unter [`/api/docs`](http://localhost:8080/api/docs) verfügbar.

## Zugriff

Öffentliche `GET`-Routen bleiben ohne API-Key erreichbar, damit der Client auf Port 3000 ohne Kontingent arbeiten kann. Ein registrierter Schlüssel kann zusätzlich über `X-API-Key` oder `Authorization: Bearer <key>` gesendet werden. Schlüssel werden ausschließlich serverseitig über `OPENWARN_API_KEYS` konfiguriert.

Schreibende Admin-Aktionen werden serverseitig geprüft. Für lokale Entwicklung ist `/api/admin/config` ohne gesetzten `OPENWARN_ADMIN_API_KEY` zugänglich; in einer produktionsähnlichen Umgebung muss `OPENWARN_ADMIN_API_KEY` gesetzt werden.

## Warnquellen

Für den Prototyp kann eine JSON-Quelle über `WARNINGS_SOURCE_URL` konfiguriert werden. Die Quelle liefert entweder ein Array oder `{ "warnings": [] }`. Die API normalisiert übliche Felder wie `title`, `description`, `priority`, `area`, `startsAt` und `endsAt` auf `GET /api/v1/warnings`.

Die Quelldaten werden nicht an den Client durchgereicht. Bei fehlender oder nicht erreichbarer Quelle liefert die öffentliche Route eine leere Warnungsliste und den Aktualisierungszeitpunkt.

## Wetterkacheln

`GET /api/v1/weather/radar/tiles/{z}/{x}/{y}.png` liefert serverseitig normalisierte PNG-Kacheln. Die Antwort verwendet `ETag`, `max-age=300` und `stale-while-revalidate=600`. Der Client versioniert die Tile-URL zusätzlich mit dem Radar-Produktzeitpunkt, sodass nur bei einem neuen Produkt ein neuer Cache-Schlüssel entsteht.
