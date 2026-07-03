'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Image as ImageIcon, Palette, Layout, FileText, Trash2 } from 'lucide-react';
import type { StudioSettings } from '@salon-tatto/shared';
import { toast } from 'sonner';
import { clearSiteCache } from '@/app/actions';
import { LocaleTabs } from '@/components/shared/locale-tabs';
import { RichTextEditor } from '@/components/shared/rich-text-editor';
import type { LocaleCode } from '@salon-tatto/shared';
import { cn } from '@/lib/utils';

type StudioPageForm = {
  studioPageContent_en: string;
  studioPageContent_es: string;
  studioBgImageUrl: string;
  studioBgColor: string;
  studioOverlayOpacity: string;
  studioLayout: string;
};

const emptyForm: StudioPageForm = {
  studioPageContent_en: '',
  studioPageContent_es: '',
  studioBgImageUrl: '',
  studioBgColor: '#0f0f0f',
  studioOverlayOpacity: '0.4',
  studioLayout: 'default',
};

const LAYOUT_OPTIONS = [
  {
    value: 'default',
    label: 'Por defecto',
    desc: 'Ancho máximo con márgenes',
    icon: '⬜',
  },
  {
    value: 'fullwidth',
    label: 'Ancho completo',
    desc: 'Contenido a pantalla completa',
    icon: '🟦',
  },
  {
    value: 'centered',
    label: 'Centrado',
    desc: 'Columna estrecha centrada',
    icon: '▫️',
  },
];

type AdminTab = 'content' | 'appearance';

export default function StudioContentPage() {
  const queryClient = useQueryClient();
  const [activeLocale, setActiveLocale] = useState<LocaleCode>('en');
  const [activeTab, setActiveTab] = useState<AdminTab>('content');
  const [form, setForm] = useState<StudioPageForm>(emptyForm);
  const [uploadingBg, setUploadingBg] = useState(false);
  const bgFileRef = useRef<HTMLInputElement>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: queryKeys.settings.all,
    queryFn: () => api.get<StudioSettings>('/settings'),
  });

  useEffect(() => {
    if (settings) {
      setForm({
        studioPageContent_en: settings.studioPageContent_en || '',
        studioPageContent_es: settings.studioPageContent_es || '',
        studioBgImageUrl: settings.studioBgImageUrl || '',
        studioBgColor: settings.studioBgColor || '#0f0f0f',
        studioOverlayOpacity: settings.studioOverlayOpacity || '0.4',
        studioLayout: settings.studioLayout || 'default',
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

  /** Sube la imagen de fondo a Cloudinary */
  const handleBgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBg(true);
    const toastId = toast.loading('Subiendo imagen de fondo...');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const data = await api.post<any>('/upload/image', formData);
      const urlId = data.url || data.cloudinaryId;
      const fullUrl = urlId.startsWith('http')
        ? urlId
        : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/${urlId}`;
      setForm((prev) => ({ ...prev, studioBgImageUrl: fullUrl }));
      toast.success('Imagen de fondo cargada', { id: toastId });
    } catch {
      toast.error('Error al subir la imagen', { id: toastId });
    } finally {
      setUploadingBg(false);
      if (bgFileRef.current) bgFileRef.current.value = '';
    }
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Página de Estudio</h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Personaliza por completo la página pública <code className="text-xs bg-muted px-1 py-0.5 rounded">/studio</code>: contenido textual, imagen de fondo, colores y layout.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={cn(
            'flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-colors whitespace-nowrap',
            activeTab === 'content'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50',
          )}
        >
          <FileText className="h-4 w-4" /> Contenido
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('appearance')}
          className={cn(
            'flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-colors whitespace-nowrap',
            activeTab === 'appearance'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50',
          )}
        >
          <Palette className="h-4 w-4" /> Apariencia
        </button>
      </div>

      {/* ─── TAB: CONTENIDO ─── */}
      {activeTab === 'content' && (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-semibold tracking-tight">Contenido Dinámico</h2>
            <LocaleTabs activeLocale={activeLocale} onLocaleChange={setActiveLocale} />
          </div>

          <div>
            <label className="block text-base font-medium mb-3">
              {activeLocale === 'en' ? 'Contenido en Inglés' : 'Contenido en Español'}
            </label>
            <RichTextEditor
              fullPage
              content={activeLocale === 'en' ? form.studioPageContent_en : form.studioPageContent_es}
              onChange={(content) => {
                setForm((prev) => ({
                  ...prev,
                  [activeLocale === 'en' ? 'studioPageContent_en' : 'studioPageContent_es']: content,
                }));
              }}
            />
          </div>
        </div>
      )}

      {/* ─── TAB: APARIENCIA ─── */}
      {activeTab === 'appearance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

          {/* Imagen de fondo */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-5">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                Imagen de Fondo
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Sube o pega la URL de una imagen para usar como fondo de la página Studio.
              </p>
            </div>

            {/* Preview de la imagen */}
            {form.studioBgImageUrl ? (
              <div className="relative rounded-lg overflow-hidden border aspect-video bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.studioBgImageUrl}
                  alt="Imagen de fondo"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: `rgba(0,0,0,${parseFloat(form.studioOverlayOpacity || '0')})` }}
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-7 px-2 text-xs gap-1"
                    onClick={() => setForm((prev) => ({ ...prev, studioBgImageUrl: '' }))}
                  >
                    <Trash2 className="h-3 w-3" /> Quitar
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed aspect-video cursor-pointer hover:border-primary/50 transition-colors bg-muted/30"
                onClick={() => bgFileRef.current?.click()}
              >
                <ImageIcon className="h-10 w-10 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">Sin imagen de fondo</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Haz click para subir</p>
              </div>
            )}

            <input ref={bgFileRef} type="file" accept="image/*" className="hidden" onChange={handleBgImageUpload} />

            {/* Botones de acción */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
                disabled={uploadingBg}
                onClick={() => bgFileRef.current?.click()}
              >
                {uploadingBg ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                {uploadingBg ? 'Subiendo...' : 'Subir archivo'}
              </Button>
            </div>

            {/* URL manual */}
            <div>
              <label className="block text-sm font-medium mb-1.5">O pega una URL de imagen</label>
              <input
                type="url"
                value={form.studioBgImageUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, studioBgImageUrl: e.target.value }))}
                placeholder="https://..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              />
            </div>
          </div>

          {/* Color y overlay */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-5">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                <Palette className="h-5 w-5 text-muted-foreground" />
                Colores y Overlay
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Ajusta el color de fondo (si no hay imagen) y el overlay sobre la imagen.
              </p>
            </div>

            {/* Color de fondo */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Color de fondo de la página</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.studioBgColor}
                  onChange={(e) => setForm((prev) => ({ ...prev, studioBgColor: e.target.value }))}
                  className="h-10 w-14 rounded-md cursor-pointer border border-input p-0.5 bg-background"
                />
                <input
                  type="text"
                  value={form.studioBgColor}
                  onChange={(e) => setForm((prev) => ({ ...prev, studioBgColor: e.target.value }))}
                  placeholder="#0f0f0f"
                  className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
              {/* Colores predefinidos */}
              <div className="flex flex-wrap gap-2 mt-1">
                {['#0f0f0f', '#1a1a2e', '#0d1117', '#f8f8f8', '#fdfbf7', '#fff8f0'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    title={c}
                    onClick={() => setForm((prev) => ({ ...prev, studioBgColor: c }))}
                    className={cn(
                      'w-6 h-6 rounded-full border-2 transition-transform hover:scale-110',
                      form.studioBgColor === c ? 'border-primary scale-110' : 'border-border/50',
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Opacidad del overlay */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">Oscuridad del overlay sobre la imagen</label>
                <span className="text-sm font-mono text-muted-foreground">
                  {Math.round(parseFloat(form.studioOverlayOpacity || '0') * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="0.9"
                step="0.05"
                value={form.studioOverlayOpacity}
                onChange={(e) => setForm((prev) => ({ ...prev, studioOverlayOpacity: e.target.value }))}
                className="w-full h-2 rounded-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Sin overlay</span>
                <span>Muy oscuro</span>
              </div>

              {/* Vista previa del overlay */}
              {form.studioBgImageUrl && (
                <div className="relative rounded-md overflow-hidden h-20 mt-2 border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.studioBgImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: `rgba(0,0,0,${form.studioOverlayOpacity})` }}
                  >
                    <span className="text-white text-xs font-medium drop-shadow">Vista previa del overlay</span>
                  </div>
                </div>
              )}
            </div>

            {/* Layout */}
            <div className="space-y-2 pt-1">
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Layout className="h-4 w-4 text-muted-foreground" />
                  Layout de la página
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {LAYOUT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, studioLayout: opt.value }))}
                      className={cn(
                        'flex flex-col items-center gap-1 p-3 rounded-lg border-2 text-center transition-all',
                        form.studioLayout === opt.value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:border-primary/40 text-muted-foreground hover:text-foreground',
                      )}
                    >
                      <span className="text-lg">{opt.icon}</span>
                      <span className="text-xs font-medium">{opt.label}</span>
                      <span className="text-[10px] text-muted-foreground leading-tight">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Sticky Save Bar ─── */}
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
