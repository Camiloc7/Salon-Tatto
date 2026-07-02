'use client';

import { useQuery } from '@tanstack/react-query';
import { faqApi } from '@/lib/api/faq';
import { FaqForm } from '@/components/admin/faq/faq-form';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function EditFaqPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: faq, isLoading, isError } = useQuery({
    queryKey: ['faq', id],
    queryFn: () => faqApi.getById(id),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !faq) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        Error al cargar la FAQ
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar FAQ</h1>
        <p className="text-muted-foreground text-sm">
          Modifica la información y traducciones de esta pregunta frecuente.
        </p>
      </div>

      <FaqForm initialData={faq} />
    </div>
  );
}
