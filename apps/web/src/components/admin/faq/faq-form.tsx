'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { faqApi, FaqItem } from '@/lib/api/faq';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
  translations: z.array(z.object({
    languageCode: z.enum(['en', 'es']),
    question: z.string().min(1, 'La pregunta es obligatoria').max(300),
    answer: z.string().min(1, 'La respuesta es obligatoria'),
  })).min(1),
});

type FaqFormData = z.infer<typeof formSchema>;

interface FaqFormProps {
  initialData?: FaqItem;
}

export function FaqForm({ initialData }: FaqFormProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map API translations to form schema, ensuring both languages exist
  let defaultTranslations = [
    { languageCode: 'es' as const, question: '', answer: '' },
    { languageCode: 'en' as const, question: '', answer: '' },
  ];

  if (initialData?.translations && initialData.translations.length > 0) {
    defaultTranslations = ['es', 'en'].map(lang => {
      const existing: any = initialData.translations.find(
        (t: any) => (t.languageCode || t.language?.code) === lang
      );
      return {
        languageCode: lang as 'es' | 'en',
        question: existing?.question || '',
        answer: existing?.answer || '',
      };
    });
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FaqFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      order: initialData?.order || 0,
      isActive: initialData?.isActive ?? true,
      translations: defaultTranslations,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'translations',
  });

  const onSubmit = async (data: FaqFormData) => {
    setIsSubmitting(true);
    try {
      if (initialData) {
        await faqApi.update(initialData.id, data);
        toast.success('FAQ actualizada exitosamente');
      } else {
        await faqApi.create(data);
        toast.success('FAQ creada exitosamente');
      }
      router.push(`/${locale}/admin/faq`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar la FAQ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="order" className="block text-sm font-medium mb-1">
            Orden de aparición
          </label>
          <input
            id="order"
            type="number"
            {...register('order')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.order && (
            <p className="mt-1 text-sm text-destructive">{errors.order.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2 h-10 mt-6">
          <input
            id="isActive"
            type="checkbox"
            {...register('isActive')}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="isActive" className="text-sm font-medium">
            Activo (Visible al público)
          </label>
        </div>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border p-4 bg-muted/20 space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              Traducción - {field.languageCode.toUpperCase()}
            </h3>
            
            <input type="hidden" {...register(`translations.${index}.languageCode`)} />

            <div>
              <label className="block text-sm font-medium mb-1">Pregunta</label>
              <input
                {...register(`translations.${index}.question`)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={`Pregunta en ${field.languageCode}`}
              />
              {errors.translations?.[index]?.question && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.translations[index]?.question?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Respuesta</label>
              <textarea
                {...register(`translations.${index}.answer`)}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={`Respuesta en ${field.languageCode}`}
              />
              {errors.translations?.[index]?.answer && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.translations[index]?.answer?.message}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${locale}/admin/faq`)}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Guardar Cambios' : 'Crear FAQ'}
        </Button>
      </div>
    </form>
  );
}
