import { z } from 'zod';

export const UpdateSeoPageSchema = z.object({
  canonicalUrl: z.string().url().optional().or(z.literal('')),
  translations: z.array(z.object({
    languageCode: z.enum(['en', 'es']),
    title: z.string().max(70).optional(),
    description: z.string().max(160).optional(),
    ogTitle: z.string().max(70).optional(),
    ogDescription: z.string().max(160).optional(),
    ogImage: z.string().url().optional().or(z.literal('')),
    keywords: z.string().max(300).optional(),
  })).optional(),
});
