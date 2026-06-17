import { z } from 'zod';
import { LocaleSchema } from './common.dto';

export const CreateBlogPostSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  featuredImage: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published']).default('draft'),
  categoryIds: z.array(z.string().uuid()).optional(),
  tagIds: z.array(z.string().uuid()).optional(),
  translations: z.array(z.object({
    languageCode: z.enum(['en', 'es']),
    title: z.string().min(1).max(200),
    excerpt: z.string().max(500).optional(),
    content: z.string().optional(),
    seoTitle: z.string().max(70).optional(),
    seoDescription: z.string().max(160).optional(),
  })).min(1),
});

export const UpdateBlogPostSchema = CreateBlogPostSchema.partial();

export const BlogPostQuerySchema = z.object({
  locale: LocaleSchema.optional(),
  status: z.enum(['draft', 'published']).optional(),
  categorySlug: z.string().optional(),
  tagSlug: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export const CreateCategorySchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  translations: z.array(z.object({
    languageCode: z.enum(['en', 'es']),
    name: z.string().min(1).max(100),
  })).min(1),
});

export const CreateTagSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  translations: z.array(z.object({
    languageCode: z.enum(['en', 'es']),
    name: z.string().min(1).max(100),
  })).min(1),
});
