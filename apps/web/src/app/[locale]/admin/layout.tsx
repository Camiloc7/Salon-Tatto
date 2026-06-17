'use client';

import { useEffect, use, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { AdminSidebar } from '@/components/layout/admin-sidebar';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default function AdminLayout({ children, params }: Props) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const { locale } = use(params);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/${locale}/admin/login`);
    }
  }, [isAuthenticated, loading, router, locale]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6 md:p-8 pt-20 md:pt-8">
        {children}
      </main>
    </div>
  );
}
