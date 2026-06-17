'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
};

type LoginCredentials = {
  email: string;
  password: string;
};

export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => api.get<User>('/auth/me'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      api.post<{ token: string; user: User }>('/auth/login', credentials),
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.token);
      queryClient.setQueryData(queryKeys.auth.me, data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      localStorage.removeItem('auth_token');
      queryClient.setQueryData(queryKeys.auth.me, null);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}
