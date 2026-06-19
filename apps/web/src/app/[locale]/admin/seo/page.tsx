'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { Button } from '@/components/ui/button';
import { LocaleTabs } from '@/components/shared/locale-tabs';
import { ImageUploader } from '@/components/shared/image-uploader';
import { Loader2, ChevronDown, ChevronRight, Save } from 'lucide-react';
import type { SeoPage, LocaleCode } from '@salon-tatto/shared';

const SEO_PAGES = [
  { key: 'home', label: 'Home' },
  { key: 'studio', label: 'Studio' },
  { key: 'artists', label: 'Artists' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'blog', label: 'Blog' },
  { key: 'contact', label: 'Contact' },
];

type PageFormState = {
  canonicalUrl: string;
  translations: Record<LocaleCode, {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    keywords: string;
  }>;
};

export default function SeoPage() {
  const t = useTranslations('admin.seo');
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeLocales, setActiveLocales] = useState<Record<string, LocaleCode>>({});
  const [forms, setForms] = useState<Record<string, PageFormState>>({});

  const { data: seoPages, isLoading } = useQuery({
    queryKey: queryKeys.seo.byPage('all'),
    queryFn: () => api.get<SeoPage[]>('/seo'),
  });

  const saveMutation = useMutation({
    mutationFn: ({ pageKey, data }: { pageKey: string; data: Record<string, unknown> }) =>
      api.patch(`/seo/${pageKey}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo'] });
      alert('SEO page saved successfully');
    },
    onError: (err: Error) => {
      alert(err.message || 'Failed to save SEO page');
    },
  });

  const getSeoForPage = (pageKey: string): SeoPage | undefined => {
    return seoPages?.find((p) => p.pageKey === pageKey);
  };

  const toggleExpand = (pageKey: string) => {
    if (expanded === pageKey) {
      setExpanded(null);
      return;
    }

    const seo = getSeoForPage(pageKey);
    if (seo) {
      setForms((prev) => ({
        ...prev,
        [pageKey]: {
          canonicalUrl: seo.canonicalUrl || '',
          translations: {
            en: {
              title: '',
              description: '',
              ogTitle: '',
              ogDescription: '',
              ogImage: '',
              keywords: '',
            },
            es: {
              title: '',
              description: '',
              ogTitle: '',
              ogDescription: '',
              ogImage: '',
              keywords: '',
            },
          },
        },
      }));
    }

    if (!activeLocales[pageKey]) {
      setActiveLocales((prev) => ({ ...prev, [pageKey]: 'en' }));
    }

    setExpanded(pageKey);
  };

  const updateField = (pageKey: string, field: string, value: string) => {
    setForms((prev) => ({
      ...prev,
      [pageKey]: { ...prev[pageKey], [field]: value },
    }));
  };

  const updateTranslationField = (
    pageKey: string,
    locale: LocaleCode,
    field: string,
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
        translations: translationsArray.length > 0 ? translationsArray : undefined,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('title')}</h1>

      <div className="space-y-3">
        {SEO_PAGES.map((page) => {
          const seo = getSeoForPage(page.key);
          const isOpen = expanded === page.key;
          const activeLocale = activeLocales[page.key] || 'en';
          const form = forms[page.key];

          return (
            <div key={page.key} className="rounded-lg border">
              <button
                type="button"
                onClick={() => toggleExpand(page.key)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-medium">{page.label}</span>
                  {seo?.title && (
                    <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                      — {seo.title}
                    </span>
                  )}
                </div>
              </button>

              {isOpen && form && (
                <div className="border-t px-6 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('form.canonical')}
                    </label>
                    <input
                      value={form.canonicalUrl}
                      onChange={(e) => updateField(page.key, 'canonicalUrl', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="https://example.com/page"
                    />
                  </div>

                  <LocaleTabs
                    activeLocale={activeLocale}
                    onLocaleChange={(loc) =>
                      setActiveLocales((prev) => ({ ...prev, [page.key]: loc }))
                    }
                  />

                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t('form.title')}
                      </label>
                      <input
                        value={form.translations[activeLocale]?.title || ''}
                        onChange={(e) =>
                          updateTranslationField(page.key, activeLocale, 'title', e.target.value)
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t('form.description')}
                      </label>
                      <textarea
                        rows={2}
                        value={form.translations[activeLocale]?.description || ''}
                        onChange={(e) =>
                          updateTranslationField(page.key, activeLocale, 'description', e.target.value)
                        }
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          {t('form.ogTitle')}
                        </label>
                        <input
                          value={form.translations[activeLocale]?.ogTitle || ''}
                          onChange={(e) =>
                            updateTranslationField(page.key, activeLocale, 'ogTitle', e.target.value)
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          {t('form.ogDescription')}
                        </label>
                        <input
                          value={form.translations[activeLocale]?.ogDescription || ''}
                          onChange={(e) =>
                            updateTranslationField(page.key, activeLocale, 'ogDescription', e.target.value)
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          {t('form.keywords')}
                        </label>
                        <input
                          value={form.translations[activeLocale]?.keywords || ''}
                          onChange={(e) =>
                            updateTranslationField(page.key, activeLocale, 'keywords', e.target.value)
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="keyword1, keyword2, keyword3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          {t('form.ogImage')}
                        </label>
                        <ImageUploader
                          value={form.translations[activeLocale]?.ogImage || ''}
                          onChange={(url) =>
                            updateTranslationField(page.key, activeLocale, 'ogImage', url)
                          }
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={() => handleSave(page.key)}
                        disabled={saveMutation.isPending}
                        className="w-full sm:w-auto"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
