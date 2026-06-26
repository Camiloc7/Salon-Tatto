'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

type CategoryTranslation = {
  languageCode: 'en' | 'es';
  name: string;
};

type Category = {
  id: string;
  slug: string;
  translations: CategoryTranslation[];
};

const categorySchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug only allows lowercase letters, numbers, and dashes'),
  translations: z.array(z.object({
    languageCode: z.enum(['en', 'es']),
    name: z.string().optional().or(z.literal('')),
  })).min(1),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function AdminCategoriesPage() {
  const t = useTranslations('admin');
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: queryKeys.blog.categories('all'),
    queryFn: () => api.get<Category[]>('/blog/categories?locale=all'),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      slug: '',
      translations: [
        { languageCode: 'en', name: '' },
        { languageCode: 'es', name: '' },
      ],
    },
  });

  const openCreate = () => {
    setEditingId(null);
    reset({
      slug: '',
      translations: [
        { languageCode: 'en', name: '' },
        { languageCode: 'es', name: '' },
      ],
    });
    setIsFormOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingId(category.id);
    reset({
      slug: category.slug,
      translations: [
        { languageCode: 'en', name: category.translations?.find(t => t.languageCode === 'en' || (t as any).language?.code === 'en')?.name || '' },
        { languageCode: 'es', name: category.translations?.find(t => t.languageCode === 'es' || (t as any).language?.code === 'es')?.name || '' },
      ],
    });
    setIsFormOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: (data: CategoryFormData) => api.post('/blog/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.categories('all') });
      toast.success('Category created successfully');
      setIsFormOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to create category'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: CategoryFormData) => api.put(`/blog/categories/${editingId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.categories('all') });
      toast.success('Category updated successfully');
      setIsFormOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to update category'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/blog/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.categories('all') });
      toast.success('Category deleted successfully');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to delete category'),
  });

  const onSubmit = (data: CategoryFormData) => {
    const validTranslations = data.translations.filter(t => t.name && t.name.trim().length > 0);
    if (validTranslations.length === 0) {
      toast.error('You must provide the category name in at least one language.');
      return;
    }
    const payload = { ...data, translations: validTranslations as any };
    if (editingId) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Categorías</h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Crea categorías para organizar tu contenido. Estas categorías se comparten tanto para los artículos del blog como para las imágenes de la galería de tatuajes.
          </p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Nueva Categoría
        </Button>
      </div>

      {isFormOpen && (
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{editingId ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-base font-medium mb-1">Nombre (English)</label>
                <input
                  {...register('translations.0.name')}
                  onChange={(e) => {
                    setValue('translations.0.name', e.target.value);
                    if (!editingId && e.target.value) {
                      setValue('slug', generateSlug(e.target.value), { shouldValidate: true });
                    }
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base"
                  placeholder="e.g. Fine Line"
                />
              </div>
              <div>
                <label className="block text-base font-medium mb-1">Nombre (Español)</label>
                <input
                  {...register('translations.1.name')}
                  onChange={(e) => {
                    setValue('translations.1.name', e.target.value);
                    if (!editingId && !watch('translations.0.name') && e.target.value) {
                      setValue('slug', generateSlug(e.target.value), { shouldValidate: true });
                    }
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base"
                  placeholder="ej. Línea Fina"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-base font-medium mb-1">URL Slug</label>
                <input
                  {...register('slug')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base"
                  placeholder="fine-line"
                />
                {errors.slug && <p className="mt-1 text-sm text-destructive">{errors.slug.message as string}</p>}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}>
                {(isSubmitting || createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-md border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">English</th>
                <th className="px-6 py-4 font-medium">Español</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No hay categorías creadas.
                  </td>
                </tr>
              ) : (
                categories?.map((cat) => (
                  <tr key={cat.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium">{cat.slug}</td>
                    <td className="px-6 py-4">
                      {cat.translations?.find(t => t.languageCode === 'en' || (t as any).language?.code === 'en')?.name || <span className="text-muted-foreground italic">Vacío</span>}
                    </td>
                    <td className="px-6 py-4">
                      {cat.translations?.find(t => t.languageCode === 'es' || (t as any).language?.code === 'es')?.name || <span className="text-muted-foreground italic">Vacío</span>}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
                            deleteMutation.mutate(cat.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
