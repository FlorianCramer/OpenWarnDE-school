import { Geolocation, type Position } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export interface UserCoordinates {
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number | null;
    heading?: number | null;
    speed?: number | null;
    timestamp: number;
}

export class GeolocationError extends Error {
    constructor(
        message: string,
        public readonly code: 'PERMISSION_DENIED' | 'TIMEOUT' | 'POSITION_UNAVAILABLE' | 'UNKNOWN',
        public readonly rawDetails?: string
    ) {
        super(message);
        this.name = 'GeolocationError';
    }
}

function extractErrorInfo(err: unknown): { code: number | null; message: string } {
    if (typeof err === 'object' && err !== null) {
        const obj = err as Record<string, unknown>;
        const code = typeof obj.code === 'number' ? obj.code : null;
        let message = '';
        if (typeof obj.message === 'string' && obj.message.trim().length > 0) {
            message = obj.message;
        } else if (err instanceof Error) {
            message = err.message;
        } else {
            message = String(err);
        }
        return { code, message };
    }
    return { code: null, message: String(err) };
}

/**
 * Ruft die Position ab. Versucht zuerst High-Accuracy (GPS); falls dies fehlschlägt
 * (häufig auf Desktop-PCs / Laptops ohne dediziertes GPS-Modul), erfolgt ein automatischer
 * Fallback auf Standard-Genauigkeit (WLAN/Netzwerk).
 */
async function queryPositionWithFallback(): Promise<Position> {
    try {
        return await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 6000,
            maximumAge: 10000,
        });
    } catch (highAccErr: unknown) {
        const info = extractErrorInfo(highAccErr);

        // Bei explizit verweigerter Berechtigung direkt abbrechen
        if (info.code === 1) {
            throw highAccErr;
        }

        // Auf Desktop-Geräten ohne GPS-Sensor schlägt enableHighAccuracy oft mit POSITION_UNAVAILABLE
        // oder TIMEOUT fehl. Wir versuchen es mit enableHighAccuracy: false (WLAN/IP-Ortung).
        try {
            return await Geolocation.getCurrentPosition({
                enableHighAccuracy: false,
                timeout: 12000,
                maximumAge: 60000,
            });
        } catch {
            // Falls auch der Fallback fehlschlägt, ursprünglichen oder aktuellen Fehler weitergeben
            throw highAccErr;
        }
    }
}

/**
 * Ermittelt den aktuellen Standort des Nutzers über Capacitor Geolocation.
 * Berücksichtigt Berechtigungen und Plattform-Unterschiede (Web vs. Native).
 */
export async function getCurrentUserLocation(): Promise<UserCoordinates> {
    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
        try {
            const check = await Geolocation.checkPermissions();
            if (check.location === 'denied') {
                const requested = await Geolocation.requestPermissions();
                if (requested.location === 'denied') {
                    throw new GeolocationError(
                        'Standortzugriff wurde verweigert. Bitte erlaube den Standort in den Systemeinstellungen der App.',
                        'PERMISSION_DENIED'
                    );
                }
            } else if (
                check.location === 'prompt' ||
                check.location === 'prompt-with-rationale'
            ) {
                const requested = await Geolocation.requestPermissions();
                if (requested.location === 'denied') {
                    throw new GeolocationError(
                        'Standortzugriff wurde verweigert.',
                        'PERMISSION_DENIED'
                    );
                }
            }
        } catch (err) {
            if (err instanceof GeolocationError) throw err;
        }
    }

    try {
        const pos = await queryPositionWithFallback();

        return {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            altitude: pos.coords.altitude,
            heading: pos.coords.heading,
            speed: pos.coords.speed,
            timestamp: pos.timestamp,
        };
    } catch (err: unknown) {
        if (err instanceof GeolocationError) throw err;

        const { code, message } = extractErrorInfo(err);
        const lower = message.toLowerCase();

        if (code === 1 || lower.includes('denied') || lower.includes('permission')) {
            throw new GeolocationError(
                'Standortzugriff wurde verweigert. Bitte prüfe die Browser-Berechtigung für localhost:3000 und stelle unter Windows sicher, dass unter „Einstellungen > Datenschutz & Sicherheit > Standort“ die Standortdienste und der Zugriff für Desktop-Apps aktiviert sind.',
                'PERMISSION_DENIED',
                message
            );
        }

        if (code === 3 || lower.includes('timeout')) {
            throw new GeolocationError(
                'Die Standortermittlung hat das Zeitlimit überschritten. Bitte prüfe deine Netzwerkverbindung und versuche es erneut.',
                'TIMEOUT',
                message
            );
        }

        if (
            code === 2 ||
            lower.includes('unavailable') ||
            lower.includes('disabled') ||
            lower.includes('acquisition failed') ||
            lower.includes('location service')
        ) {
            throw new GeolocationError(
                'Der Standort konnte vom System nicht ermittelt werden (Position unavailable). Unter Windows: Bitte prüfe in den Windows-Einstellungen unter „Datenschutz & Sicherheit > Standort“, ob die Standortdienste sowie „Zulassen, dass Desktop-Apps auf Ihren Standort zugreifen“ aktiviert sind.',
                'POSITION_UNAVAILABLE',
                message
            );
        }

        throw new GeolocationError(
            `Standortermittlung fehlgeschlagen (${message || 'Position nicht verfügbar'}). Bitte prüfe die Geräteeinstellungen.`,
            'UNKNOWN',
            message
        );
    }
}
