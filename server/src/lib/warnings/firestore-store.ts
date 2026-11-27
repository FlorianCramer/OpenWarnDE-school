import { FieldValue } from 'firebase-admin/firestore';
import { firestore } from '@/lib/firebase';
import { warningSchema, type Warning, type WarningInput } from './model';

const collection = firestore.collection('warnings');

const mapWarning = (snapshot: FirebaseFirestore.DocumentSnapshot): Warning =>
    warningSchema.parse({ id: snapshot.id, ...snapshot.data() });

export const listFirestoreWarnings = async (publicOnly = false) => {
    const query = publicOnly ? collection.where('status', '==', 'published') : collection;
    const snapshot = await query.orderBy('updatedAt', 'desc').get();
    return snapshot.docs.map(mapWarning).filter((warning) => !publicOnly || warning.visible);
};

export const createFirestoreWarning = async (input: WarningInput) => {
    const ref = collection.doc();
    const now = new Date().toISOString();
    const warning = warningSchema.parse({ ...input, id: ref.id, createdAt: now, updatedAt: now, publishedAt: null });
    await ref.set(warning);
    return warning;
};

export const updateFirestoreWarning = async (id: string, input: WarningInput) => {
    const ref = collection.doc(id);
    const snapshot = await ref.get();
    if (!snapshot.exists) return null;
    const current = mapWarning(snapshot);
    const warning = warningSchema.parse({ ...input, id, createdAt: current.createdAt, updatedAt: new Date().toISOString(), publishedAt: current.publishedAt });
    await ref.set(warning);
    return warning;
};

export const publishFirestoreWarning = async (id: string) => {
    const ref = collection.doc(id);
    const snapshot = await ref.get();
    if (!snapshot.exists) return null;
    const now = new Date().toISOString();
    await ref.update({ status: 'published', publishedAt: now, updatedAt: now, _updated: FieldValue.serverTimestamp() });
    return mapWarning(await ref.get());
};
