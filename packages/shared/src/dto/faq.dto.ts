import { z } from 'zod';
import { LocaleSchema } from './common.dto';

export const CreateFaqSchema = z.object({
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
  translations: z.array(z.object({
    languageCode: z.enum(['en', 'es']),
    question: z.string().min(1).max(300),
    answer: z.string().min(1),
  })).min(1),
});

export const UpdateFaqSchema = CreateFaqSchema.partial();

export const FaqQuerySchema = z.object({
  locale: LocaleSchema.optional(),
  isActive: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});
