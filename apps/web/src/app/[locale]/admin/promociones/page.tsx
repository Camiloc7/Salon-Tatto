'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Megaphone } from 'lucide-react';
import { toast } from 'sonner';
import { clearCacheByTag } from '@/app/actions/cache';
import type { Promotion } from '@/components/PromotionBanner';

type PromotionForm = {
  message: string;
  code: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
};

const emptyForm: PromotionForm = {
  message: '',
  code: '',
  backgroundColor: '#000000',
  textColor: '#ffffff',
  isActive: false,
};

export default function PromotionsPage() {
  const t = useTranslations('admin'); // Fallback translations
  const queryClient = useQueryClient();
  const [form, setForm] = useState<PromotionForm>(emptyForm);
  const [promotionId, setPromotionId] = useState<string | null>(null);

  const { data: activePromotion, isLoading } = useQuery({
    queryKey: ['promotions', 'active'],
    queryFn: async () => {
      try {
        return await api.get<Promotion>('/promotions/active');
      } catch {
        return null; // Return null if 404
      }
    },
  });

  useEffect(() => {
    if (activePromotion) {
      setPromotionId(activePromotion.id);
      setForm({
        message: activePromotion.message || '',
        code: activePromotion.code || '',
        backgroundColor: activePromotion.backgroundColor || '#000000',
        textColor: activePromotion.textColor || '#ffffff',
        isActive: activePromotion.isActive ?? false,
      });
    }
  }, [activePromotion]);

  const saveMutation = useMutation({
    mutationFn: async (data: PromotionForm) => {
      const payload = {
        ...data,
        code: data.code.trim() === '' ? null : data.code,
      };
      
      if (promotionId) {
        return api.patch(`/promotions/${promotionId}`, payload);
      } else {
        return api.post('/promotions', payload);
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      await clearCacheByTag('promotions');
      toast.success('Promoción guardada exitosamente');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Error al guardar la promoción');
    },
  });

  const updateField = (field: keyof PromotionForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.message.trim() && form.isActive) {
      toast.error('El mensaje es obligatorio si la promoción está activa');
      return;
    }
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
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Banner de Promociones</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Configura el banner superior (marquee) que aparece en todas las páginas públicas del sitio.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saveMutation.isPending} className="w-full sm:w-auto shrink-0">
          {saveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Guardar Cambios
        </Button>
      </div>

      <div className="rounded-lg border bg-card p-6 space-y-6 shadow-sm">
        
        {/* Toggle Activo */}
        <div className="flex items-center space-x-3 pb-4 border-b">
          <input 
            type="checkbox" 
            id="isActive" 
            checked={form.isActive}
            onChange={(e) => updateField('isActive', e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
          />
          <label htmlFor="isActive" className="text-base font-semibold cursor-pointer select-none">
            Activar Banner de Promoción
          </label>
        </div>

        {/* Mensaje */}
        <div>
          <label className="block text-sm font-medium mb-1">Mensaje Principal *</label>
          <input
            value={form.message}
            onChange={(e) => updateField('message', e.target.value)}
            placeholder="Ej: ¡20% DE DESCUENTO EN TATUAJES DE REALISMO ESTE MES!"
            className="flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          />
          <p className="text-xs text-muted-foreground mt-1">Este texto se desplazará continuamente de derecha a izquierda.</p>
        </div>

        {/* Código (Opcional) */}
        <div>
          <label className="block text-sm font-medium mb-1">Código de Descuento (Opcional)</label>
          <input
            value={form.code}
            onChange={(e) => updateField('code', e.target.value)}
            placeholder="Ej: TATTOO20"
            className="flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          />
        </div>

        {/* Colores */}
        <div className="grid grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-sm font-medium mb-1">Color de Fondo</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.backgroundColor}
                onChange={(e) => updateField('backgroundColor', e.target.value)}
                className="h-10 w-16 p-1 rounded-md border bg-background cursor-pointer"
              />
              <span className="text-sm uppercase font-mono">{form.backgroundColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Color de Texto</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.textColor}
                onChange={(e) => updateField('textColor', e.target.value)}
                className="h-10 w-16 p-1 rounded-md border bg-background cursor-pointer"
              />
              <span className="text-sm uppercase font-mono">{form.textColor}</span>
            </div>
          </div>
        </div>

        {/* Vista Previa */}
        <div className="pt-6 border-t">
          <h3 className="text-sm font-medium mb-3">Vista Previa</h3>
          <div 
            className="w-full overflow-hidden whitespace-nowrap py-3 relative flex items-center rounded-md border shadow-inner"
            style={{ backgroundColor: form.backgroundColor, color: form.textColor }}
          >
            <div className="px-4 tracking-wider text-sm md:text-base font-semibold">
              {form.message || 'El mensaje aparecerá aquí...'}
              {form.code && (
                <span className="ml-4 px-2 py-0.5 bg-white/20 rounded font-bold border border-white/30">
                  {form.code}
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Nota: La animación de desplazamiento (Marquee) solo se verá en el sitio público.
          </p>
        </div>
      </div>
    </div>
  );
}
