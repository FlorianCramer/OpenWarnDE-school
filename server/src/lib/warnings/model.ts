import { z } from 'zod';

const germanyAreaSchema = z.object({
    type: z.literal('Polygon'),
    coordinates: z.array(z.array(z.array(z.number()).min(2)).min(4)).min(1),
}).refine(
    (area) => area.coordinates.flat(1).every(([longitude, latitude]) =>
        longitude >= 5.8 && longitude <= 15.2 && latitude >= 47.1 && latitude <= 55.2,
    ),
    { message: 'Warnungsgebiete müssen innerhalb Deutschlands liegen.', path: ['coordinates'] },
);

export const warningSchema = z.object({
    id: z.string().regex(/^[a-z0-9][a-z0-9-]{0,48}$/),
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().min(1).max(4000),
    priority: z.enum(['low', 'normal', 'middle', 'high', 'critical']),
    area: germanyAreaSchema,
    visible: z.boolean().default(true),
    status: z.enum(['draft', 'published', 'resolved']),
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    publishedAt: z.string().datetime().nullable(),
});

export const warningInputSchema = warningSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    publishedAt: true,
});

export type Warning = z.infer<typeof warningSchema>;
export type WarningInput = z.infer<typeof warningInputSchema>;
