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
import { RichTextEditor } from '@/components/shared/rich-text-editor';
import { SeoPreviewCard } from '@/components/admin/seo-preview-fieldset';
import { GalleryManager } from '@/components/admin/artists/gallery-manager';
import { Loader2, ArrowLeft, User, ImageIcon, Settings, Save, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import type { Artist, LocaleCode } from '@salon-tatto/shared';

const translationSchema = z.object({
  languageCode: z.enum(['en', 'es']),
  name: z.string().max(100).optional().or(z.literal('')),
  specialty: z.string().max(200).optional(),
  biography: z.string().optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
});

const updateArtistSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  avatar: z.string().optional().nullable(),
  instagramUrl: z.string().url().optional().or(z.literal('')),
  orderIndex: z.coerce.number().default(0),
  translations: z.array(translationSchema).min(1),
});

type UpdateArtistFormData = z.infer<typeof updateArtistSchema>;

const generateSlug = (name: string) => {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

export default function EditArtistPage() {
  const t = useTranslations('admin.artists');
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [activeLocale, setActiveLocale] = useState<LocaleCode>('en');
  const [activeTab, setActiveTab] = useState<'profile' | 'portfolio' | 'seo'>('profile');

  const id = params.id as string;

  const { data: artist, isLoading } = useQuery({
    queryKey: queryKeys.artists.detail(id),
    queryFn: () => api.get<Artist>(`/artists/id/${id}?locale=all`),
  });

  const getTranslation = (code: string) => {
    if (!artist || !artist.translations) return { languageCode: code as any, name: '', specialty: '', biography: '', seoTitle: '', seoDescription: '' };
    const tr = artist.translations.find((tr: any) => tr.language?.code === code || tr.languageCode === code);
    return {
      languageCode: code as any,
      name: tr?.name || '',
      specialty: tr?.specialty || '',
      biography: tr?.biography || '',
      seoTitle: tr?.seoTitle || '',
      seoDescription: tr?.seoDescription || '',
    };
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateArtistFormData>({
    resolver: zodResolver(updateArtistSchema),
    values: artist ? {
      slug: artist.slug,
      avatar: artist.avatar,
      instagramUrl: artist.instagramUrl || '',
      orderIndex: artist.orderIndex,
      translations: ['en', 'es'].map(getTranslation),
    } : undefined,
  });

  const updateTranslationField = (field: keyof z.infer<typeof translationSchema>, value: string) => {
    const currentTranslations = watch('translations') || [];
    const updated = currentTranslations.map((tr) => {
      if (tr.languageCode === activeLocale) {
        return { ...tr, [field]: value };
      }
      return tr;
    });
    setValue('translations', updated as any, { shouldDirty: true });
  };

  const currentTranslation = watch('translations')?.find((tr) => tr.languageCode === activeLocale);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateArtistFormData) => api.patch(`/artists/${id}`, data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.artists.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.artists.detail(id) });
      
      // Revalidar la caché del servidor Next.js para reflejar los cambios en la web
      const { clearCacheByTag } = await import('@/app/actions/cache');
      await clearCacheByTag('artists');

      toast.success('Artist updated successfully!');
    },
    onError: () => {
      toast.error('Hubo un error al actualizar el artista. Por favor, inténtalo de nuevo más tarde.');
    },
  });

  const onSubmit = (data: UpdateArtistFormData) => {
    const validTranslations = data.translations.filter(t => t.name && t.name.trim().length > 0);
    if (validTranslations.length === 0) {
      toast.error('You must provide the artist name in at least one language.');
      return;
    }
    updateMutation.mutate({ ...data, translations: validTranslations as any });
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
    <div className="space-y-6 w-full max-w-6xl mx-auto pb-24 relative">
      <div className="flex items-center gap-4">
        <Link href="/admin/artists">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('edit')}</h1>
      </div>

      <div className="flex border-b overflow-x-auto no-scrollbar">
        <button 
          type="button" 
          onClick={() => setActiveTab('profile')} 
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'profile' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
        >
          <User className="h-4 w-4" /> Perfil Público
        </button>
        <button 
          type="button" 
          onClick={() => setActiveTab('portfolio')} 
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'portfolio' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
        >
          <ImageIcon className="h-4 w-4" /> Portafolio
        </button>
        <button 
          type="button" 
          onClick={() => setActiveTab('seo')} 
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'seo' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
        >
          <Settings className="h-4 w-4" /> Ajustes Avanzados
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* TAB 1: PERFIL PÚBLICO */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Foto e Info General */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-semibold tracking-tight border-b pb-4">Foto e Info Básica</h2>
              
              <div>
                <label className="block text-base font-medium mb-3">Foto de Perfil (Avatar)</label>
                <ImageUploader
                  value={watch('avatar') || ''}
                  onChange={(url) => setValue('avatar', url, { shouldDirty: true })}
                />
              </div>

              <div>
                <label className="block text-base font-medium mb-2">Instagram URL</label>
                <input
                  {...register('instagramUrl')}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="https://instagram.com/..."
                />
                {errors.instagramUrl && <p className="mt-1.5 text-sm text-destructive">{errors.instagramUrl.message}</p>}
              </div>
            </div>

            {/* Identidad y Traducciones */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-semibold tracking-tight border-b pb-4">Identidad</h2>

              <LocaleTabs activeLocale={activeLocale} onLocaleChange={setActiveLocale} />

              <div className="space-y-5 pt-2">
                <div>
                  <label className="block text-base font-medium mb-2">Nombre del Artista</label>
                  <input
                    value={currentTranslation?.name || ''}
                    onChange={(e) => updateTranslationField('name', e.target.value)}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  />
                  {errors.translations?.[activeLocale === 'en' ? 0 : 1]?.name && (
                    <p className="mt-1.5 text-sm text-destructive">{errors.translations[activeLocale === 'en' ? 0 : 1]?.name?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-base font-medium mb-2">Especialidad</label>
                  <input
                    value={currentTranslation?.specialty || ''}
                    onChange={(e) => updateTranslationField('specialty', e.target.value)}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    placeholder="Ej. Realismo, Tradicional, Fine Line"
                  />
                  {errors.translations?.[activeLocale === 'en' ? 0 : 1]?.specialty && (
                    <p className="mt-1.5 text-sm text-destructive">{errors.translations[activeLocale === 'en' ? 0 : 1]?.specialty?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-base font-medium mb-2">Biografía</label>
                  <RichTextEditor
                    key={activeLocale}
                    content={currentTranslation?.biography || ''}
                    onChange={(content) => updateTranslationField('biography', content)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PORTAFOLIO */}
        {activeTab === 'portfolio' && (
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 min-h-[500px]">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold tracking-tight">Galería de Tatuajes</h2>
              <p className="text-muted-foreground mt-1">Sube, ordena y clasifica los mejores trabajos de este artista.</p>
            </div>
            
            <div className="pt-2">
              <GalleryManager artistId={id} />
            </div>
          </div>
        )}

        {/* TAB 3: SEO Y AJUSTES */}
        {activeTab === 'seo' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Ajustes de Sistema */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-semibold tracking-tight border-b pb-4">Sistema</h2>
              
              <div>
                <label className="flex text-base font-medium mb-2 items-center justify-between">
                  URL Amigable (Slug)
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="sm" 
                    className="h-7 px-3 text-xs"
                    onClick={() => {
                      const enName = watch('translations')?.find(t => t.languageCode === 'en')?.name;
                      const esName = watch('translations')?.find(t => t.languageCode === 'es')?.name;
                      const nameToUse = enName || esName || '';
                      if (nameToUse) {
                        setValue('slug', generateSlug(nameToUse), { shouldValidate: true, shouldDirty: true });
                      }
                    }}
                  >
                    <Wand2 className="h-3 w-3 mr-1.5" /> Autogenerar
                  </Button>
                </label>
                <input
                  {...register('slug', {
                    onChange: (e) => {
                      setValue('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'), { shouldValidate: true, shouldDirty: true });
                    }
                  })}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
                {errors.slug && <p className="mt-1.5 text-sm text-destructive">{errors.slug.message}</p>}
              </div>

              <div>
                <label className="block text-base font-medium mb-2">Orden de Visualización</label>
                <input
                  type="number"
                  {...register('orderIndex')}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  placeholder="0 (Aparecerá primero)"
                />
              </div>
            </div>

            {/* Optimización SEO */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-semibold tracking-tight">Optimización SEO</h2>
                <LocaleTabs activeLocale={activeLocale} onLocaleChange={setActiveLocale} />
              </div>

              <div className="pt-2">
                <SeoPreviewCard
                  title={currentTranslation?.seoTitle || ''}
                  description={currentTranslation?.seoDescription || ''}
                  onTitleChange={(val) => updateTranslationField('seoTitle', val)}
                  onDescriptionChange={(val) => updateTranslationField('seoDescription', val)}
                  defaultTitle={currentTranslation?.name || ''}
                  defaultDescription={currentTranslation?.biography?.slice(0, 150) || ''}
                />
              </div>
            </div>
          </div>
        )}

        {/* STICKY ACTION BAR */}
        <div className="fixed bottom-0 left-0 right-0 md:left-[240px] md:right-0 p-4 bg-background/80 backdrop-blur-md border-t flex justify-end gap-4 z-40 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)]">
          <Link href="/admin/artists">
            <Button type="button" variant="outline" size="lg" className="w-full sm:w-auto h-11 px-8">Cancelar</Button>
          </Link>
          <Button type="submit" size="lg" disabled={isSubmitting || updateMutation.isPending} className="w-full sm:w-auto h-11 px-8 gap-2">
            {(isSubmitting || updateMutation.isPending) ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
