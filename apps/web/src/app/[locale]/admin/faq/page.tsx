'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { faqApi } from '@/lib/api/faq';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Power, PowerOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import type { FaqItem } from '@/lib/api/faq';

export default function FaqListPage() {
  const queryClient = useQueryClient();
  const params = useParams();
  const locale = params.locale as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['faq', 'admin', locale],
    queryFn: () => faqApi.getAll({ locale, isAdmin: true }),
  });

  const toggleMutation = useMutation({
    mutationFn: (faq: FaqItem) =>
      faqApi.update(faq.id, { isActive: !faq.isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq', 'admin'] });
      toast.success('Estado actualizado');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => faqApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq', 'admin'] });
      toast.success('FAQ eliminada exitosamente');
    },
  });

  const handleDelete = (faq: FaqItem) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta pregunta frecuente?')) {
      deleteMutation.mutate(faq.id);
    }
  };

  const faqs = data?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Preguntas Frecuentes</h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Gestiona las preguntas y respuestas que aparecen en la sección de FAQ de la página principal.
          </p>
        </div>
        <Link href={`/${locale}/admin/faq/create`} className="w-full sm:w-auto shrink-0">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nueva FAQ
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          Error al cargar las preguntas frecuentes
        </div>
      )}

      {faqs && (
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-base font-medium text-muted-foreground">Pregunta</th>
                  <th className="px-4 py-3 text-left text-base font-medium text-muted-foreground">Orden</th>
                  <th className="px-4 py-3 text-left text-base font-medium text-muted-foreground">Estado</th>
                  <th className="px-4 py-3 text-right text-base font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((faq) => (
                  <tr key={faq.id} className="border-b last:border-0">
                    <td className="px-4 py-3 text-sm">
                      {faq.translations?.[0]?.question || 'Sin título'}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{faq.order}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          faq.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {faq.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/${locale}/admin/faq/${faq.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleMutation.mutate(faq)}
                          disabled={toggleMutation.isPending}
                        >
                          {faq.isActive ? (
                            <PowerOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Power className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(faq)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {faqs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      No hay preguntas frecuentes registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
