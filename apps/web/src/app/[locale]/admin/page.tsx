'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '@/providers/auth-provider';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { Users, FileText, LayoutGrid, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#e11d48', '#2563eb', '#16a34a', '#d97706'];

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

  const { data: categoriesData } = useQuery({
    queryKey: ['categories-list'],
    queryFn: () => api.get<any[]>('/categories'),
  });

  const { data: trafficData } = useQuery({
    queryKey: queryKeys.analytics.traffic,
    queryFn: () => api.get<{ name: string; visits: number; unique: number }[]>('/analytics/traffic'),
  });

  const stats = [
    { label: t('totalArtists'), value: artistsData?.meta.total ?? 0, icon: Users, trend: '+12%', color: 'text-blue-500' },
    { label: t('totalPosts'), value: blogData?.meta.total ?? 0, icon: FileText, trend: '+5%', color: 'text-green-500' },
    { label: 'Total Categories', value: categoriesData?.length ?? 0, icon: LayoutGrid, trend: '+0%', color: 'text-orange-500' },
  ];

  const pieData = [
    { name: 'Artists', value: artistsData?.meta.total ?? 0 },
    { name: 'Blogs', value: blogData?.meta.total ?? 0 },
    { name: 'Categories', value: categoriesData?.length ?? 0 },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent w-fit">
          {t('welcome')}, {user?.name ?? 'Admin'}
        </h1>
        <p className="text-muted-foreground text-lg">{t('title')}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-muted ${stat.color}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-600/10 px-2 py-1 rounded-full">
                  <TrendingUp className="h-4 w-4" />
                  {stat.trend}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-semibold">Website Traffic</h3>
              <p className="text-sm text-muted-foreground">Live data from Google Analytics (Last 28 Days)</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888888', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888888', fontSize: 12 }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="visits" name="Total Visits" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                <Area type="monotone" dataKey="unique" name="Unique Visitors" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorUnique)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col">
          <div>
            <h3 className="text-xl font-semibold">Content Distribution</h3>
            <p className="text-sm text-muted-foreground">Breakdown of active resources.</p>
          </div>
          
          <div className="flex-1 flex items-center justify-center min-h-[300px] mt-4">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#000' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground flex flex-col items-center gap-2">
                <LayoutGrid className="h-8 w-8 opacity-20" />
                <p>No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
