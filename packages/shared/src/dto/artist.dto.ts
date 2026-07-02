import { z } from 'zod';
import { LocaleSchema } from './common.dto';

export const CreateArtistSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  avatar: z.string().url().optional(),
  instagramUrl: z.string().url().optional().or(z.literal('')),
  orderIndex: z.number().int().min(0).default(0),
  translations: z.array(z.object({
    languageCode: z.enum(['en', 'es']),
    name: z.string().min(1).max(200),
    biography: z.string().max(100000).optional(),
    specialty: z.string().max(500).optional(),
    seoTitle: z.string().max(70).optional(),
    seoDescription: z.string().max(160).optional(),
  })).min(1),
});

export const UpdateArtistSchema = CreateArtistSchema.partial();

export const ArtistQuerySchema = z.object({
  locale: LocaleSchema.optional(),
  isActive: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});
