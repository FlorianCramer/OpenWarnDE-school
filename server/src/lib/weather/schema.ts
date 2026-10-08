import { z } from 'zod';

const id = z
    .string()
    .trim()
    .regex(/^[a-z0-9][a-z0-9-]{0,48}$/);
export const sourceSchema = z.object({
    id,
    name: z.string().trim().min(1).max(80),
    type: z.enum(['openweathermap', 'rainviewer', 'dwd-radolan', 'radrview', 'xyz']),
    product: z.string().trim().max(80),
    apiKey: z.string().max(200),
    urlTemplate: z.string().max(500),
    enabled: z.boolean(),
});
export const inputSchema = z.object({ sourceId: id, weight: z.number().min(0).max(100) });
export const configSchema = z
    .object({
        sources: z.array(sourceSchema).max(30),
        weather: z.object({
            enabled: z.boolean(),
            opacity: z.number().min(0).max(1),
            inputs: z.array(inputSchema).max(12),
        }),
    })
    .superRefine((config, ctx) => {
        const ids = new Set<string>();
        for (const source of config.sources) {
            if (ids.has(source.id))
                ctx.addIssue({ code: 'custom', message: `Datenquelle "${source.id}" ist doppelt` });
            ids.add(source.id);
            if (
                source.type === 'xyz' &&
                !['{z}', '{x}', '{y}'].every((p) => source.urlTemplate.includes(p))
            ) {
                ctx.addIssue({
                    code: 'custom',
                    message: `Quelle "${source.name}" braucht {z}, {x} und {y}`,
                });
            }
            if (source.type === 'xyz' && !/^https?:\/\//.test(source.urlTemplate)) {
                ctx.addIssue({
                    code: 'custom',
                    message: `Quelle "${source.name}" braucht eine HTTP(S)-URL`,
                });
            }
        }
        for (const input of config.weather.inputs) {
            if (!ids.has(input.sourceId))
                ctx.addIssue({
                    code: 'custom',
                    message: `Unbekannte Wetterquelle "${input.sourceId}"`,
                });
        }
    });
export type WeatherConfig = z.infer<typeof configSchema>;
export type WeatherSource = z.infer<typeof sourceSchema>;
