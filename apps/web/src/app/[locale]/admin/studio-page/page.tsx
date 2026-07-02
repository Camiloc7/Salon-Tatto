'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import type { StudioSettings } from '@salon-tatto/shared';
import { toast } from 'sonner';
import { clearSiteCache } from '@/app/actions';
import { LocaleTabs } from '@/components/shared/locale-tabs';
import { RichTextEditor } from '@/components/shared/rich-text-editor';
import type { LocaleCode } from '@salon-tatto/shared';

type StudioPageForm = {
  studioPageContent_en: string;
  studioPageContent_es: string;
};

const emptyForm: StudioPageForm = {
  studioPageContent_en: '',
  studioPageContent_es: '',
};

export default function StudioContentPage() {
  const queryClient = useQueryClient();
  const [activeLocale, setActiveLocale] = useState<LocaleCode>('en');
  const [form, setForm] = useState<StudioPageForm>(emptyForm);

  const { data: settings, isLoading } = useQuery({
    queryKey: queryKeys.settings.all,
    queryFn: () => api.get<StudioSettings>('/settings'),
  });

  useEffect(() => {
    if (settings) {
      setForm({
        studioPageContent_en: settings.studioPageContent_en || '',
        studioPageContent_es: settings.studioPageContent_es || '',
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (data: StudioPageForm) => api.put('/settings', { settings: data }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
      toast.success('Contenido del Studio guardado exitosamente');
      await clearSiteCache();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Error al guardar');
    },
  });

  const handleSave = () => {
    saveMutation.mutate(form);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto pb-24 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Página de Estudio</h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Edita el contenido completo de la página pública "/studio". Puedes añadir texto, fotos, aplicar formatos y personalizar la experiencia para tus clientes.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-semibold tracking-tight">Contenido Dinámico</h2>
          <LocaleTabs activeLocale={activeLocale} onLocaleChange={setActiveLocale} />
        </div>

        <div>
          <label className="block text-base font-medium mb-3">
            {activeLocale === 'en' ? 'Contenido en Inglés' : 'Contenido en Español'}
          </label>
          <RichTextEditor
            content={activeLocale === 'en' ? form.studioPageContent_en : form.studioPageContent_es}
            onChange={(content) => {
              setForm((prev) => ({
                ...prev,
                [activeLocale === 'en' ? 'studioPageContent_en' : 'studioPageContent_es']: content
              }));
            }}
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:left-[240px] md:right-0 p-4 bg-background/80 backdrop-blur-md border-t flex justify-end gap-4 z-40 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)]">
        <Button 
          type="button" 
          onClick={handleSave} 
          disabled={saveMutation.isPending} 
          size="lg" 
          className="w-full sm:w-auto h-11 px-8 gap-2"
        >
          {saveMutation.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
