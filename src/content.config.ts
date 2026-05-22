// Astro content collections (v6 API with explicit loaders).
// Empty/draft schema ready for Phase 2 — fill in cursos when content lands.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cursos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/cursos' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    draft: z.boolean().default(true),
  }),
});

export const collections = { cursos };
