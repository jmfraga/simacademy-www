// Astro content collections (v6 API with explicit loaders).
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cursos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cursos' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string().optional(),
    description: z.string(),
    modality: z.enum(['online', 'presencial', 'hibrido']),
    dates: z.string().optional(),
    duration: z.string().optional(),
    price: z.string().optional(),
    audience: z.string().optional(),
    href: z.string().url(),
    accent: z.enum(['purple', 'green', 'gold']).default('purple'),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    avalFlasic: z.string().optional(),
    coBranded: z.string().optional(),
  }),
});

export const collections = { cursos };
