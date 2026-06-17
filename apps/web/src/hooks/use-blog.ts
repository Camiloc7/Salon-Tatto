'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { BlogPost, Category, Tag, PaginatedResponse } from '@salon-tatto/shared';

export function useBlogPosts(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.blog.list(params),
    queryFn: () => api.get<PaginatedResponse<BlogPost>>('/blog', { params }),
  });
}

export function useBlogPost(slug: string, locale?: string) {
  return useQuery({
    queryKey: queryKeys.blog.detail(slug, locale),
    queryFn: () => api.get<BlogPost>(`/blog/${slug}`, { params: { locale } }),
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.blog.categories,
    queryFn: () => api.get<Category[]>('/blog/categories'),
  });
}

export function useTags() {
  return useQuery({
    queryKey: queryKeys.blog.tags,
    queryFn: () => api.get<Tag[]>('/blog/tags'),
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => api.post<BlogPost>('/blog', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.all });
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.put<BlogPost>(`/blog/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.all });
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/blog/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.all });
    },
  });
}

export function useTogglePublish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'draft' | 'published' }) =>
      api.patch<BlogPost>(`/blog/${id}/publish`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.all });
    },
  });
}
