'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { Artist, PaginatedResponse } from '@salon-tatto/shared';

export function useArtists(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.artists.list(params),
    queryFn: () => api.get<PaginatedResponse<Artist>>('/artists', { params }),
  });
}

export function useArtist(slug: string, locale?: string) {
  return useQuery({
    queryKey: queryKeys.artists.detail(slug, locale),
    queryFn: () => api.get<Artist>(`/artists/${slug}`, { params: { locale } }),
    enabled: !!slug,
  });
}

export function useCreateArtist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => api.post<Artist>('/artists', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.artists.all });
    },
  });
}

export function useUpdateArtist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.put<Artist>(`/artists/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.artists.all });
    },
  });
}

export function useDeleteArtist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/artists/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.artists.all });
    },
  });
}
