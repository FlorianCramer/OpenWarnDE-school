import { getMessaging } from 'firebase-admin/messaging';
import { firebaseAuth } from '@/lib/firebase';

export async function sendWarningPush(title: string, body: string) {
    const topic = process.env.FCM_WARNING_TOPIC?.trim();
    if (!topic) return { status: 'not-configured' as const };
    await getMessaging(firebaseAuth.app).send({
        topic,
        notification: { title, body },
        data: { kind: 'warning' },
    });
    return { status: 'sent' as const, topic };
}
