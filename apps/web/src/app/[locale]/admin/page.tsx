'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '@/providers/auth-provider';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { Users, FileText, Image } from 'lucide-react';

export default function AdminDashboard() {
  const t = useTranslations('admin.dashboard');
  const { user } = useAuth();

  const { data: artistsData } = useQuery({
    queryKey: queryKeys.artists.list({ limit: 1 }),
    queryFn: () => api.get<{ meta: { total: number } }>('/artists', { params: { limit: 1 } }),
  });

  const { data: blogData } = useQuery({
    queryKey: queryKeys.blog.list({ limit: 1 }),
    queryFn: () => api.get<{ meta: { total: number } }>('/blog', { params: { limit: 1 } }),
  });

  const stats = [
    { label: t('totalArtists'), value: artistsData?.meta.total ?? 0, icon: Users },
    { label: t('totalPosts'), value: blogData?.meta.total ?? 0, icon: FileText },
    { label: t('totalImages'), value: '—', icon: Image },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t('welcome')}, {user?.name ?? 'Admin'}
        </h1>
        <p className="text-muted-foreground mt-1">{t('title')}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
