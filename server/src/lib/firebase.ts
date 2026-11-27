import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
export const hasServerFirebase = Boolean(serviceAccount || process.env.FIREBASE_EMULATOR_HOST);
const app = getApps().length
    ? getApps()[0]
    : initializeApp(serviceAccount ? { credential: cert(JSON.parse(serviceAccount)) } : undefined);

export const firebaseAuth = getAuth(app);
export const firestore = getFirestore(app);
