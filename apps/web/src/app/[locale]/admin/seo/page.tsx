'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { LocaleTabs } from '@/components/shared/locale-tabs';
import { ImageUploader } from '@/components/shared/image-uploader';
import { Loader2, ChevronDown, ChevronRight, Save, Plus, Trash2, Globe } from 'lucide-react';
import { toast } from 'sonner';
import type { LocaleCode } from '@salon-tatto/shared';

const DEFAULT_PAGES = ['home', 'studio', 'artists', 'gallery', 'blog', 'contact'];

type TranslationField = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  keywords: string;
};

type PageFormState = {
  canonicalUrl: string;
  noIndex: boolean;
  noFollow: boolean;
  translations: Record<LocaleCode, TranslationField>;
};

const emptyTranslation = (): TranslationField => ({
  title: '',
  description: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  keywords: '',
});

export default function SeoPage() {
  const t = useTranslations('admin.seo');
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeLocales, setActiveLocales] = useState<Record<string, LocaleCode>>({});
  const [forms, setForms] = useState<Record<string, PageFormState>>({});
  const [newPageKey, setNewPageKey] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  const { data: seoPages, isLoading } = useQuery({
    queryKey: ['seo'],
    queryFn: () => api.get<any[]>('/seo/pages'),
  });

  const saveMutation = useMutation({
    mutationFn: ({ pageKey, data }: { pageKey: string; data: Record<string, unknown> }) =>
      api.put(`/seo/pages/${pageKey}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo'] });
      toast.success('SEO page saved successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to save SEO page');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (pageKey: string) => api.delete(`/seo/pages/${pageKey}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo'] });
      setExpanded(null);
      toast.success('SEO page deleted successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete SEO page');
    },
  });

  const sitemapMutation = useMutation({
    mutationFn: () => api.post('/seo/generate-sitemap'),
    onSuccess: () => {
      toast.success('Sitemap generation triggered');
    },
    onError: () => {
      toast.error('Failed to generate sitemap');
    },
  });

  const getSeoForPage = (pageKey: string) => {
    return seoPages?.find((p) => p.pageKey === pageKey);
  };

  const getTranslationData = (seo: any, locale: string): TranslationField => {
    const tData = seo?.translations?.find((t: any) => t.language?.code === locale || t.languageCode === locale);
    return {
      title: tData?.title || '',
      description: tData?.description || '',
      ogTitle: tData?.ogTitle || '',
      ogDescription: tData?.ogDescription || '',
      ogImage: tData?.ogImage || '',
      keywords: tData?.keywords || '',
    };
  };

  const toggleExpand = (pageKey: string) => {
    if (expanded === pageKey) {
      setExpanded(null);
      return;
    }

    const seo = getSeoForPage(pageKey);
    setForms((prev) => ({
      ...prev,
      [pageKey]: {
        canonicalUrl: seo?.canonicalUrl || '',
        noIndex: seo?.noIndex || false,
        noFollow: seo?.noFollow || false,
        translations: {
          en: getTranslationData(seo, 'en'),
          es: getTranslationData(seo, 'es'),
        },
      },
    }));

    if (!activeLocales[pageKey]) {
      setActiveLocales((prev) => ({ ...prev, [pageKey]: 'en' }));
    }

    setExpanded(pageKey);
  };

  const updateField = (pageKey: string, field: string, value: any) => {
    setForms((prev) => ({
      ...prev,
      [pageKey]: { ...prev[pageKey], [field]: value },
    }));
  };

  const updateTranslationField = (
    pageKey: string,
    locale: LocaleCode,
    field: keyof TranslationField,
    value: string,
  ) => {
    setForms((prev) => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey],
        translations: {
          ...prev[pageKey]?.translations,
          [locale]: {
            ...prev[pageKey]?.translations?.[locale],
            [field]: value,
          },
        },
      },
    }));
  };

  const handleSave = (pageKey: string) => {
    const form = forms[pageKey];
    if (!form) return;

    const translationsArray = (['en', 'es'] as LocaleCode[])
      .filter((loc) => form.translations[loc])
      .map((locale) => ({
        languageCode: locale,
        title: form.translations[locale].title || undefined,
        description: form.translations[locale].description || undefined,
        ogTitle: form.translations[locale].ogTitle || undefined,
        ogDescription: form.translations[locale].ogDescription || undefined,
        ogImage: form.translations[locale].ogImage || undefined,
        keywords: form.translations[locale].keywords || undefined,
      }));

    saveMutation.mutate({
      pageKey,
      data: {
        canonicalUrl: form.canonicalUrl || undefined,
        noIndex: form.noIndex,
        noFollow: form.noFollow,
        translations: translationsArray.length > 0 ? translationsArray : undefined,
      },
    });
  };

  const handleAddNewPage = () => {
    if (!newPageKey.trim()) return;
    const key = newPageKey.trim().toLowerCase().replace(/[^a-z0-9\-\/]/g, '');
    
    // Check if it already exists to avoid overriding immediately
    if (seoPages?.some(p => p.pageKey === key) || DEFAULT_PAGES.includes(key)) {
      toast.error('This page key already exists');
      return;
    }

    // Initialize an empty form
    setForms((prev) => ({
      ...prev,
      [key]: {
        canonicalUrl: '',
        noIndex: false,
        noFollow: false,
        translations: {
          en: emptyTranslation(),
          es: emptyTranslation(),
        },
      },
    }));
    setActiveLocales((prev) => ({ ...prev, [key]: 'en' }));
    setExpanded(key);
    setIsAddingNew(false);
    setNewPageKey('');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Combine default pages with custom pages from DB and locally added pages
  const customPagesFromDb = seoPages?.map(p => p.pageKey).filter(k => !DEFAULT_PAGES.includes(k)) || [];
  const localCustomPages = Object.keys(forms).filter(k => !DEFAULT_PAGES.includes(k) && !customPagesFromDb.includes(k));
  const ALL_PAGES = [...DEFAULT_PAGES, ...customPagesFromDb, ...localCustomPages];

  return (
    <div className="space-y-8 max-w-4xl pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Optimiza cada página para los motores de búsqueda (Google). Configura los títulos, descripciones e imágenes de vista previa para redes sociales.
          </p>
        </div>
        <Button onClick={() => sitemapMutation.mutate()} disabled={sitemapMutation.isPending} variant="outline" className="gap-2 shrink-0">
          {sitemapMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
          Generate Sitemap
        </Button>
      </div>

      <div className="space-y-4">
        {ALL_PAGES.map((pageKey) => {
          const seo = getSeoForPage(pageKey);
          const isOpen = expanded === pageKey;
          const activeLocale = activeLocales[pageKey] || 'en';
          const form = forms[pageKey];
          const isCustom = !DEFAULT_PAGES.includes(pageKey);

          return (
            <div key={pageKey} className={`rounded-xl border transition-colors ${isOpen ? 'bg-card border-primary/50 shadow-sm' : 'bg-background hover:bg-muted/30'}`}>
              <button
                type="button"
                onClick={() => toggleExpand(pageKey)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <div className="flex items-center gap-3">
                  {isOpen ? (
                    <ChevronDown className="h-5 w-5 text-primary" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="font-semibold text-lg capitalize">{pageKey.replace(/\//g, ' / ')}</span>
                  {!isOpen && seo?.translations?.[0]?.title && (
                    <span className="text-sm text-muted-foreground hidden sm:inline-block truncate max-w-[300px] ml-4">
                      — {seo.translations[0].title}
                    </span>
                  )}
                  {isCustom && !isOpen && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-secondary text-[10px] uppercase font-bold text-secondary-foreground">Custom</span>
                  )}
                  {seo?.noIndex && !isOpen && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-destructive/10 text-[10px] uppercase font-bold text-destructive">No-Index</span>
                  )}
                </div>
              </button>

              {isOpen && form && (
                <div className="border-t px-6 py-6 space-y-8 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-primary uppercase tracking-wider">Technical SEO</h4>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          {t('form.canonical')}
                        </label>
                        <input
                          value={form.canonicalUrl}
                          onChange={(e) => updateField(pageKey, 'canonicalUrl', e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder="https://example.com/page"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Leave blank to use default URL.</p>
                      </div>

                      <div className="flex flex-col gap-3 p-4 bg-muted/30 rounded-lg border">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                            checked={form.noIndex}
                            onChange={(e) => updateField(pageKey, 'noIndex', e.target.checked)}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">No-Index</span>
                            <span className="text-xs text-muted-foreground">Prevent search engines from indexing this page.</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                            checked={form.noFollow}
                            onChange={(e) => updateField(pageKey, 'noFollow', e.target.checked)}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">No-Follow</span>
                            <span className="text-xs text-muted-foreground">Prevent search engines from following links on this page.</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-primary uppercase tracking-wider">SERP Preview</h4>
                      <div className="bg-white p-4 rounded-lg border shadow-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-muted rounded-full overflow-hidden flex items-center justify-center text-[10px] font-bold text-muted-foreground">LOGO</div>
                          <div>
                            <div className="text-[12px] text-[#202124] leading-tight font-medium">La Rola Tattoo NYC</div>
                            <div className="text-[11px] text-[#4d5156] leading-tight">https://salon-tatto.com › {pageKey === 'home' ? '' : pageKey}</div>
                          </div>
                        </div>
                        <h3 className="text-[18px] text-[#1a0dab] font-medium leading-tight pt-1 hover:underline cursor-pointer truncate">
                          {form.translations[activeLocale]?.title || 'Page Title Example'}
                        </h3>
                        <p className="text-[13px] text-[#4d5156] leading-snug line-clamp-2">
                          {form.translations[activeLocale]?.description || 'This is how your page description will look on Google search results. Make it catchy.'}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">Google might occasionally choose to show different text depending on the user's exact search query.</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-primary uppercase tracking-wider">Content Meta</h4>
                      <LocaleTabs
                        activeLocale={activeLocale}
                        onLocaleChange={(loc) =>
                          setActiveLocales((prev) => ({ ...prev, [pageKey]: loc }))
                        }
                      />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          {t('form.title')} <span className="text-xs text-muted-foreground font-normal">(50-60 characters ideal)</span>
                        </label>
                        <input
                          value={form.translations[activeLocale]?.title || ''}
                          onChange={(e) =>
                            updateTranslationField(pageKey, activeLocale, 'title', e.target.value)
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          {t('form.description')} <span className="text-xs text-muted-foreground font-normal">(150-160 characters ideal)</span>
                        </label>
                        <textarea
                          rows={3}
                          value={form.translations[activeLocale]?.description || ''}
                          onChange={(e) =>
                            updateTranslationField(pageKey, activeLocale, 'description', e.target.value)
                          }
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2 pt-2">
                        <div className="space-y-4">
                          <h5 className="font-medium text-sm">Open Graph (Social Media)</h5>
                          <div>
                            <label className="block text-xs font-medium mb-1 text-muted-foreground">
                              {t('form.ogTitle')}
                            </label>
                            <input
                              value={form.translations[activeLocale]?.ogTitle || ''}
                              onChange={(e) =>
                                updateTranslationField(pageKey, activeLocale, 'ogTitle', e.target.value)
                              }
                              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1 text-muted-foreground">
                              {t('form.ogDescription')}
                            </label>
                            <textarea
                              rows={2}
                              value={form.translations[activeLocale]?.ogDescription || ''}
                              onChange={(e) =>
                                updateTranslationField(pageKey, activeLocale, 'ogDescription', e.target.value)
                              }
                              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1 text-muted-foreground">
                              {t('form.ogImage')}
                            </label>
                            <ImageUploader
                              value={form.translations[activeLocale]?.ogImage || ''}
                              onChange={(url) =>
                                updateTranslationField(pageKey, activeLocale, 'ogImage', url)
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h5 className="font-medium text-sm">Additional Tags</h5>
                          <div>
                            <label className="block text-xs font-medium mb-1 text-muted-foreground">
                              {t('form.keywords')}
                            </label>
                            <textarea
                              rows={3}
                              value={form.translations[activeLocale]?.keywords || ''}
                              onChange={(e) =>
                                updateTranslationField(pageKey, activeLocale, 'keywords', e.target.value)
                              }
                              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="tattoo, realism, artist, studio..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t">
                      <Button
                        onClick={() => handleSave(pageKey)}
                        disabled={saveMutation.isPending}
                        size="lg"
                        className="w-full sm:w-auto"
                      >
                        {saveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Page SEO
                      </Button>

                      {isCustom && (
                        <Button
                          variant="destructive"
                          onClick={() => {
                            if(confirm(`Are you sure you want to delete the SEO settings for ${pageKey}?`)) {
                              deleteMutation.mutate(pageKey);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="w-full sm:w-auto"
                        >
                          {deleteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                          Delete Page
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isAddingNew ? (
          <div className="bg-card border rounded-xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div>
              <label className="block text-sm font-medium mb-1">New Page Route Key</label>
              <div className="flex gap-2">
                <input
                  value={newPageKey}
                  onChange={(e) => setNewPageKey(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. services/piercing"
                  autoFocus
                />
                <Button onClick={handleAddNewPage}>Add</Button>
                <Button variant="ghost" onClick={() => setIsAddingNew(false)}>Cancel</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Enter the URL path after the language code (e.g., if url is /en/services/piercing, type "services/piercing").</p>
            </div>
          </div>
        ) : (
          <Button variant="outline" className="w-full border-dashed py-8" onClick={() => setIsAddingNew(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Custom Page Route
          </Button>
        )}
      </div>
    </div>
  );
}
