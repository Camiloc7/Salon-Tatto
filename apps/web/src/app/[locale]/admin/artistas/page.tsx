'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/shared/pagination';
import { Plus, Edit, Trash2, Power, PowerOff, Loader2 } from 'lucide-react';
import type { Artist, PaginatedResponse } from '@salon-tatto/shared';

import { useParams } from 'next/navigation';

export default function ArtistListPage() {
  const t = useTranslations('admin.artists');
  const tc = useTranslations('admin');
  const queryClient = useQueryClient();
  const params = useParams();
  const locale = params.locale as string;
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.artists.list({ page, limit, locale }),
    queryFn: () =>
      api.get<PaginatedResponse<Artist>>('/artists', { params: { page, limit, locale } }),
  });

  const toggleMutation = useMutation({
    mutationFn: (artist: Artist) =>
      api.patch(`/artists/${artist.id}`, { isActive: !artist.isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.artists.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/artists/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.artists.all });
      alert('Artist deleted');
    },
  });

  const handleDelete = (artist: Artist) => {
    if (window.confirm(t('confirmDelete'))) {
      deleteMutation.mutate(artist.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Gestiona los perfiles de los artistas del estudio. Aquí puedes editar su información, redes sociales y añadir o eliminar imágenes de su galería personal.
          </p>
        </div>
        <Link href="/admin/artistas/create" className="w-full sm:w-auto shrink-0">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            {t('create')}
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
          Error loading artists
        </div>
      )}

      {data && (
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-base font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left text-base font-medium text-muted-foreground">Specialty</th>
                  <th className="px-4 py-3 text-left text-base font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right text-base font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((artist) => (
                  <tr key={artist.id} className="border-b last:border-0">
                    <td className="px-4 py-3 text-sm">{artist.name || artist.slug}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{artist.specialty || '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          artist.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {artist.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/artistas/${artist.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleMutation.mutate(artist)}
                          disabled={toggleMutation.isPending}
                        >
                          {artist.isActive ? (
                            <PowerOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Power className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(artist)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data.data.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      No artists found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data && data.meta.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.meta.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
