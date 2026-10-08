import { z } from 'zod';

const idSchema = z
    .string()
    .trim()
    .regex(/^[a-z0-9][a-z0-9-]{0,48}$/, 'Id: Kleinbuchstaben, Ziffern und Bindestriche');

const httpUrl = z
    .string()
    .trim()
    .refine((value) => value.startsWith('https://') || value.startsWith('http://'), {
        message: 'URL muss mit http:// oder https:// beginnen',
    });

export const sourceSchema = z.object({
    id: idSchema,
    name: z.string().trim().min(1).max(80),
    type: z.enum(['openweathermap', 'rainviewer', 'xyz']),
    /** OWM-Kartenname, RainViewer-Farbschema oder frei für eigene URLs. */
    product: z.string().trim().max(80),
    apiKey: z.string().max(200),
    /** Nur type=xyz. Platzhalter: {z} {x} {y} {apiKey} */
    urlTemplate: z.string().max(500),
    enabled: z.boolean(),
});

export const layerInputSchema = z.object({
    sourceId: idSchema,
    /** Relatives Gewicht. 0 nimmt die Quelle aus diesem Layer. */
    weight: z.number().min(0).max(100),
});

export const mapLayerSchema = z.object({
    id: idSchema,
    name: z.string().trim().min(1).max(80),
    enabled: z.boolean(),
    basemap: z.object({
        urlTemplate: httpUrl,
        attribution: z.string().max(500),
        maxZoom: z.number().int().min(1).max(22),
    }),
    weather: z.object({
        opacity: z.number().min(0).max(1),
        inputs: z.array(layerInputSchema).max(12),
    }),
});

export const appConfigSchema = z
    .object({
        sources: z.array(sourceSchema).max(30),
        layers: z.array(mapLayerSchema).min(1).max(30),
    })
    .superRefine((config, ctx) => {
        const sourceIds = new Set<string>();
        for (const source of config.sources) {
            if (sourceIds.has(source.id)) {
                ctx.addIssue({
                    code: 'custom',
                    message: `Datenquelle "${source.id}" ist doppelt`,
                });
            }
            sourceIds.add(source.id);
            if (
                source.type === 'xyz' &&
                !['{z}', '{x}', '{y}'].every((placeholder) =>
                    source.urlTemplate.includes(placeholder),
                )
            ) {
                ctx.addIssue({
                    code: 'custom',
                    message: `Quelle "${source.name}" braucht eine URL mit {z}, {x} und {y}`,
                });
            }
            if (
                source.type === 'xyz' &&
                source.urlTemplate &&
                !source.urlTemplate.startsWith('http://') &&
                !source.urlTemplate.startsWith('https://')
            ) {
                ctx.addIssue({
                    code: 'custom',
                    message: `Quelle "${source.name}": URL muss mit http:// oder https:// beginnen`,
                });
            }
        }

        const layerIds = new Set<string>();
        for (const layer of config.layers) {
            if (layerIds.has(layer.id)) {
                ctx.addIssue({
                    code: 'custom',
                    message: `Layer "${layer.id}" ist doppelt`,
                });
            }
            layerIds.add(layer.id);
            for (const input of layer.weather.inputs) {
                if (!sourceIds.has(input.sourceId)) {
                    ctx.addIssue({
                        code: 'custom',
                        message: `Layer "${layer.name}" verweist auf unbekannte Quelle "${input.sourceId}"`,
                    });
                }
            }
        }
    });

export type DataSource = z.infer<typeof sourceSchema>;
export type LayerInput = z.infer<typeof layerInputSchema>;
export type MapLayer = z.infer<typeof mapLayerSchema>;
export type AppConfig = z.infer<typeof appConfigSchema>;
