'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { Button } from '@/components/ui/button';
import { ImageUploader } from '@/components/shared/image-uploader';
import { LocaleTabs } from '@/components/shared/locale-tabs';
import { RichTextEditor } from '@/components/shared/rich-text-editor';
import { SeoPreviewCard } from '@/components/admin/seo-preview-fieldset';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Category, Tag, LocaleCode } from '@salon-tatto/shared';
import { toast } from 'sonner';

const translationSchema = z.object({
  languageCode: z.enum(['en', 'es']),
  title: z.string().max(200).optional().or(z.literal('')),
  excerpt: z.string().max(500).optional(),
  content: z.string().optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
});

const createPostSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  featuredImage: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  translations: z.array(translationSchema).min(1),
});

type CreatePostFormData = z.infer<typeof createPostSchema>;

export default function CreateBlogPostPage() {
  const t = useTranslations('admin.blog');
  const ta = useTranslations('admin');
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeLocale, setActiveLocale] = useState<LocaleCode>('en');

  const { data: categories } = useQuery({
    queryKey: queryKeys.blog.categories(),
    queryFn: () => api.get<Category[]>('/blog/categories'),
  });

  const { data: tags } = useQuery({
    queryKey: queryKeys.blog.tags,
    queryFn: () => api.get<Tag[]>('/blog/tags'),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      slug: '',
      featuredImage: '',
      status: 'draft',
      categoryIds: [],
      tagIds: [],
      translations: [
        { languageCode: 'en' as const, title: '', excerpt: '', content: '', seoTitle: '', seoDescription: '' },
        { languageCode: 'es' as const, title: '', excerpt: '', content: '', seoTitle: '', seoDescription: '' },
      ],
    },
  });

  const translations = watch('translations');
  const currentTranslation = translations?.find((t) => t.languageCode === activeLocale);
  const currentIndex = translations?.findIndex((t) => t.languageCode === activeLocale);

  const updateTranslationField = (field: string, value: string) => {
    if (currentIndex === undefined || currentIndex < 0) return;
    const newTranslations = [...(watch('translations') || [])];
    newTranslations[currentIndex] = { ...newTranslations[currentIndex], [field]: value };
    setValue('translations', newTranslations, { shouldDirty: true });
  };

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    const updated = selectedCategories.includes(id)
      ? selectedCategories.filter((c) => c !== id)
      : [...selectedCategories, id];
    setSelectedCategories(updated);
    setValue('categoryIds', updated, { shouldDirty: true });
  };

  const toggleTag = (id: string) => {
    const updated = selectedTags.includes(id)
      ? selectedTags.filter((t) => t !== id)
      : [...selectedTags, id];
    setSelectedTags(updated);
    setValue('tagIds', updated, { shouldDirty: true });
  };

  const createMutation = useMutation({
    mutationFn: (data: CreatePostFormData) => api.post('/blog', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.all });
      toast.success('Post created successfully');
      router.push('/admin/blog');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create post');
    },
  });

  const onSubmit = (data: CreatePostFormData) => {
    const validTranslations = data.translations.filter(t => t.title && t.title.trim().length > 0);
    if (validTranslations.length === 0) {
      toast.error('You must provide the post title in at least one language.');
      return;
    }
    createMutation.mutate({ ...data, translations: validTranslations as any });
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('create')}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-lg font-semibold">General</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-base font-medium mb-1">{t('form.slug')}</label>
              <input
                {...register('slug')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              {errors.slug && <p className="mt-1 text-sm text-destructive">{errors.slug.message}</p>}
            </div>

            <div>
              <label className="block text-base font-medium mb-1">Status</label>
              <select
                {...register('status')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="draft">{t('draft')}</option>
                <option value="published">{t('published')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-base font-medium mb-1">{t('form.featuredImage')}</label>
            <ImageUploader
              value={watch('featuredImage') || ''}
              onChange={(url) => setValue('featuredImage', url, { shouldDirty: true })}
            />
          </div>

          <div>
            <label className="block text-base font-medium mb-1">{t('form.category')}</label>
            <div className="flex flex-wrap gap-2">
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                    selectedCategories.includes(cat.id)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-input hover:border-primary'
                  }`}
                >
                  {cat.name || cat.slug}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-base font-medium mb-1">{t('form.tags')}</label>
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                    selectedTags.includes(tag.id)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-input hover:border-primary'
                  }`}
                >
                  {tag.name || tag.slug}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Translations</h2>

          <LocaleTabs activeLocale={activeLocale} onLocaleChange={setActiveLocale} />

          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-base font-medium mb-1">{t('form.title')}</label>
              <input
                value={currentTranslation?.title || ''}
                onChange={(e) => updateTranslationField('title', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div>
              <label className="block text-base font-medium mb-1">{t('form.excerpt')}</label>
              <textarea
                rows={2}
                value={currentTranslation?.excerpt || ''}
                onChange={(e) => updateTranslationField('excerpt', e.target.value)}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div>
              <label className="block text-base font-medium mb-1">{t('form.content')}</label>
              <RichTextEditor
                content={currentTranslation?.content || ''}
                onChange={(html) => updateTranslationField('content', html)}
              />
            </div>

            <div className="pt-4 border-t mt-4">
              <h3 className="text-lg font-semibold mb-4">Optimización SEO</h3>
              <SeoPreviewCard
                title={currentTranslation?.seoTitle || ''}
                description={currentTranslation?.seoDescription || ''}
                onTitleChange={(val) => updateTranslationField('seoTitle', val)}
                onDescriptionChange={(val) => updateTranslationField('seoDescription', val)}
                defaultTitle={currentTranslation?.title || ''}
                defaultDescription={currentTranslation?.excerpt || ''}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button type="submit" disabled={isSubmitting || createMutation.isPending} className="w-full sm:w-auto">
            {(isSubmitting || createMutation.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t('create')}
          </Button>
          <Link href="/admin/blog" className="w-full sm:w-auto">
            <Button type="button" variant="outline" className="w-full sm:w-auto">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
