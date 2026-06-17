import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const LocaleSchema = z.enum(['en', 'es']).default('en');

export const SlugSchema = z.string().min(1).max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Must be a valid slug (lowercase, hyphens)');

export const UUIDSchema = z.string().uuid();
