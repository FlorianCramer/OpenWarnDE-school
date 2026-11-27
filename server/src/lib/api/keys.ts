import { createHash, randomBytes } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { firestore } from '@/lib/firebase';
import { hasServerFirebase } from '@/lib/firebase';

const collection = firestore.collection('apiKeys');
const localFile = path.join(process.cwd(), 'data', 'api-keys.json');

const hashKey = (value: string) => createHash('sha256').update(value).digest('hex');

export type ApiKeyRecord = {
    id: string;
    label: string;
    prefix: string;
    unlimited: true;
    active: boolean;
    createdAt: string;
};

export const listApiKeys = async (): Promise<ApiKeyRecord[]> => {
    if (!hasServerFirebase) return readLocal();
    const snapshot = await collection.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ApiKeyRecord);
};

export const createApiKey = async (label: string) => {
    const raw = `owde_${randomBytes(28).toString('base64url')}`;
    const ref = collection.doc();
    const record: ApiKeyRecord = {
        id: ref.id,
        label,
        prefix: raw.slice(0, 12),
        unlimited: true,
        active: true,
        createdAt: new Date().toISOString(),
    };
    if (hasServerFirebase) {
        await ref.set({ ...record, hash: hashKey(raw) });
    } else {
        const records = readLocal();
        records.unshift(record);
        writeLocal(records);
    }
    return { record, key: raw };
};

export const revokeApiKey = async (id: string) => {
    if (!hasServerFirebase) {
        const records = readLocal();
        const index = records.findIndex((record) => record.id === id);
        if (index < 0) return false;
        records[index] = { ...records[index], active: false };
        writeLocal(records);
        return true;
    }
    const ref = collection.doc(id);
    const snapshot = await ref.get();
    if (!snapshot.exists) return false;
    await ref.update({ active: false });
    return true;
};

const readLocal = (): ApiKeyRecord[] => {
    if (!fs.existsSync(localFile)) return [];
    return JSON.parse(fs.readFileSync(localFile, 'utf8')) as ApiKeyRecord[];
};

const writeLocal = (records: ApiKeyRecord[]) => {
    fs.mkdirSync(path.dirname(localFile), { recursive: true });
    fs.writeFileSync(localFile, JSON.stringify(records, null, 2));
};
