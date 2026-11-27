import { firestore } from '@/lib/firebase';
import { configSchema, type WeatherConfig } from './schema';

const reference = firestore.collection('configuration').doc('weather');

export async function getFirestoreWeatherConfig() {
    const snapshot = await reference.get();
    if (!snapshot.exists) return null;
    return configSchema.parse(snapshot.data());
}

export async function saveFirestoreWeatherConfig(input: unknown) {
    const config = configSchema.parse(input);
    await reference.set({ ...config, updatedAt: new Date().toISOString() });
    return config;
}
