'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { GalleryManager } from '@/components/admin/artists/gallery-manager';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Artist, LocaleCode } from '@salon-tatto/shared';

const translationSchema = z.object({
  languageCode: z.enum(['en', 'es']),
  name: z.string().min(1).max(200),
  biography: z.string().max(5000).optional(),
  specialty: z.string().max(500).optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
});

const updateArtistSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  avatar: z.string().optional(),
  instagramUrl: z.string().optional(),
  orderIndex: z.coerce.number().int().min(0).default(0),
  translations: z.array(translationSchema).min(1),
});

type UpdateArtistFormData = z.infer<typeof updateArtistSchema>;

export default function EditArtistPage() {
  const t = useTranslations('admin.artists');
  const ta = useTranslations('admin');
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [activeLocale, setActiveLocale] = useState<LocaleCode>('en');

  const id = params.id as string;

  const { data: artist, isLoading } = useQuery({
    queryKey: queryKeys.artists.detail(id),
    queryFn: () => api.get<Artist>(`/artists/${id}`),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateArtistFormData>({
    resolver: zodResolver(updateArtistSchema),
    values: artist
      ? {
          slug: artist.slug,
          avatar: artist.avatar || '',
          instagramUrl: artist.instagramUrl || '',
          orderIndex: artist.orderIndex,
          translations: [
            { languageCode: 'en' as const, name: '', biography: '', specialty: '', seoTitle: '', seoDescription: '' },
            { languageCode: 'es' as const, name: '', biography: '', specialty: '', seoTitle: '', seoDescription: '' },
          ],
        }
      : undefined,
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

  const updateMutation = useMutation({
    mutationFn: (data: UpdateArtistFormData) => api.patch(`/artists/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.artists.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.artists.detail(id) });
      alert('Artist updated successfully');
      router.push('/admin/artistas');
    },
    onError: (err: Error) => {
      alert(err.message || 'Failed to update artist');
    },
  });

  const onSubmit = (data: UpdateArtistFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!artist) {
    return <div className="text-center py-12 text-muted-foreground">Artist not found</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/artistas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('edit')}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold">General</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">{t('form.slug')}</label>
              <input
                {...register('slug')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.slug && <p className="mt-1 text-sm text-destructive">{errors.slug.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t('form.instagram')}</label>
              <input
                {...register('instagramUrl')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t('form.order')}</label>
              <input
                type="number"
                {...register('orderIndex')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('form.avatar')}</label>
            <ImageUploader
              value={watch('avatar') || ''}
              onChange={(url) => setValue('avatar', url, { shouldDirty: true })}
            />
          </div>
        </div>

        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold">Translations</h2>

          <LocaleTabs activeLocale={activeLocale} onLocaleChange={setActiveLocale} />

          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('form.name')}</label>
              <input
                value={currentTranslation?.name || ''}
                onChange={(e) => updateTranslationField('name', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t('form.specialty')}</label>
              <input
                value={currentTranslation?.specialty || ''}
                onChange={(e) => updateTranslationField('specialty', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t('form.biography')}</label>
              <textarea
                rows={5}
                value={currentTranslation?.biography || ''}
                onChange={(e) => updateTranslationField('biography', e.target.value)}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">{ta('seo.form.title')}</label>
                <input
                  value={currentTranslation?.seoTitle || ''}
                  onChange={(e) => updateTranslationField('seoTitle', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{ta('seo.form.description')}</label>
                <input
                  value={currentTranslation?.seoDescription || ''}
                  onChange={(e) => updateTranslationField('seoDescription', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold">Gallery</h2>
          <GalleryManager artistId={id} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button type="submit" disabled={isSubmitting || updateMutation.isPending} className="w-full sm:w-auto">
            {(isSubmitting || updateMutation.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t('edit')}
          </Button>
          <Link href="/admin/artistas" className="w-full sm:w-auto">
            <Button type="button" variant="outline" className="w-full sm:w-auto">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
