'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/shared/pagination';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import type { BlogPost, PaginatedResponse } from '@salon-tatto/shared';
import { toast } from 'sonner';

import { useParams } from 'next/navigation';
import { ConfirmDeleteButton } from '@/components/shared/confirm-delete-button';

export default function BlogListPage() {
  const t = useTranslations('admin.blog');
  const queryClient = useQueryClient();
  const params = useParams();
  const locale = params.locale as string;
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.blog.list({ page, limit, locale }),
    queryFn: () =>
      api.get<PaginatedResponse<BlogPost>>('/blog', { params: { page, limit, locale } }),
  });

  const toggleMutation = useMutation({
    mutationFn: (post: BlogPost) =>
      api.patch(`/blog/${post.id}`, {
        status: post.status === 'published' ? 'draft' : 'published',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/blog/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.all });
      toast.success('Post deleted');
    },
  });

  const handleDelete = (post: BlogPost) => {
    deleteMutation.mutate(post.id);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Crea y gestiona los artículos de tu blog. Puedes guardarlos como borrador o publicarlos directamente para que aparezcan en la web principal.
          </p>
        </div>
        <Link href="/admin/blog/create" className="w-full sm:w-auto shrink-0">
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
          Error loading blog posts
        </div>
      )}

      {data && (
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-base font-medium text-muted-foreground">Title</th>
                  <th className="px-4 py-3 text-left text-base font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-base font-medium text-muted-foreground">Author</th>
                  <th className="px-4 py-3 text-left text-base font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-right text-base font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((post) => (
                  <tr key={post.id} className="border-b last:border-0">
                    <td className="px-4 py-3 text-base font-medium">{post.title || post.slug}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {post.status === 'published' ? t('published') : t('draft')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {post.author?.name || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(post.publishedAt || post.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/blog/${post.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleMutation.mutate(post)}
                          disabled={toggleMutation.isPending}
                        >
                          {post.status === 'published' ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        <ConfirmDeleteButton 
                          onConfirm={() => handleDelete(post)} 
                          disabled={deleteMutation.isPending}
                          confirmText="¿Eliminar?"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                {data.data.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      No blog posts found
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
