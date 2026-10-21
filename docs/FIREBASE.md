# Alles über firebase

Auth: aktiv
Storage: aktiv

# Storage

## user

- admin
- dev

## data_warning

### status

- draft
- published
- resolved

### severity

- low
- normal
- middle
- high
- critical

## Technische Verknüpfung der Admin-UI

Die zentrale Firebase-Initialisierung liegt in `admin/src/lib/firebase.ts`. Sie exportiert `auth` und `db` und verhindert mit `getApps()`/`getApp()` eine doppelte Initialisierung.

Benötigte Werte in `admin/.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Die Loginseite nutzt `signInWithEmailAndPassword`. Der geschützte Bereich liest das Profil aus `user/{uid}` und prüft `role` (`admin` oder `dev`) sowie `active === true`. Das Feld `display_name` wird für die Begrüßung verwendet. Logout ist in Sidebar und Benutzer-Dropdown eingebunden.

Das Dashboard liest Warnungen aus `warnings/{warningId}` und zeigt `title`, `description`, `status` und `createdAt` an.

Empfohlene Firestore-Regeln:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /user/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false;
    }
    match /data_warnings/{warningId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

Für den lokalen Test: Authentication-Benutzer anlegen, dessen UID als Dokument-ID unter `user/{UID}` verwenden, `email`, `display_name`, `role` und `active: true` setzen, Regeln veröffentlichen und die Admin-UI auf `http://localhost:3001` starten.

Abweichung zur Zielarchitektur: Die aktuelle UI greift direkt auf Firestore zu. Ziel ist künftig der Zugriff ausschließlich über die API auf Port `8080` mit serverseitiger ID-Token-, Rollen- und `active`-Prüfung.
