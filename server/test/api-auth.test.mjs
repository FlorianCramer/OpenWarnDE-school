import test from 'node:test';
import assert from 'node:assert/strict';

const apiBaseUrl = process.env.API_BASE_URL ?? 'http://127.0.0.1:8080';
const apiKey = process.env.API_KEY ?? 'bhdh-jdj';
const rateLimitRequests = Number(process.env.RATE_LIMIT_REQUESTS ?? 100);

// Dieser Katalog bildet die aktuell dokumentierten API-Endpunkte ab.
// Der Test prüft absichtlich den strengeren Sicherheitswunsch:
// Jeder Endpunkt muss ohne gültigen API-Key abweisen.
const endpoints = [
    { method: 'GET', path: '/api/v1/warnings' },
    { method: 'GET', path: '/api/v1/weather' },
    { method: 'GET', path: '/api/v1/weather/radar/metadata' },
    { method: 'GET', path: '/api/v1/weather/radar/tiles/5/16/10.png' },
    { method: 'GET', path: '/api/v1/location/search?q=Berlin' },
    { method: 'GET', path: '/api/v1/admin/warnings' },
    { method: 'POST', path: '/api/v1/admin/warnings' },
    { method: 'GET', path: '/api/v1/admin/api-keys' },
];

const request = (endpoint, headers = {}) => fetch(`${apiBaseUrl}${endpoint.path}`, {
    method: endpoint.method,
    headers: { Accept: 'application/json', ...headers },
    body: endpoint.method === 'POST' ? JSON.stringify({}) : undefined,
});

test(`Rate-Limit weist den Request nach ${rateLimitRequests} Aufrufen mit 429 ab`, async () => {
    const responses = [];
    for (let index = 0; index <= rateLimitRequests; index += 1) {
        responses.push(await request({ method: 'GET', path: '/api/v1/warnings' }, { 'X-API-Key': apiKey }));
        if (responses.at(-1)?.status === 429) break;
    }

    assert.ok(
        responses.some((response) => response.status === 429),
        `Keiner der ${responses.length} Requests wurde mit 429 Too Many Requests beantwortet.`,
    );
});

test('alle dokumentierten API-Endpunkte weisen fehlende API-Keys ab', async (t) => {
    await t.test('API-Server ist erreichbar', async () => {
        await assert.doesNotReject(request({ method: 'GET', path: '/api/docs' }));
    });

    for (const endpoint of endpoints) {
        await t.test(`${endpoint.method} ${endpoint.path} ohne API-Key`, async () => {
            const response = await request(endpoint);
            assert.ok(
                response.status === 401 || response.status === 403,
                `${endpoint.method} ${endpoint.path} antwortete mit ${response.status}; erwartet 401 oder 403`,
            );
        });
    }
});

test('ein gültiger API-Key wird vom Testaufbau mitgesendet', async () => {
    const response = await request({ method: 'GET', path: '/api/v1/warnings' }, {
        'X-API-Key': apiKey,
    });
    assert.notEqual(response.status, 401, 'Der API-Key wurde nicht akzeptiert.');
    assert.notEqual(response.status, 403, 'Der API-Key wurde nicht akzeptiert.');
});
