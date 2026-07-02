'use client';

import { useEffect, use, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { AdminSidebar } from '@/components/layout/admin-sidebar';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default function AdminLayout({ children, params }: Props) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const { locale } = use(params);

  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/${locale}/login`);
      return;
    }

    if (!loading && isAuthenticated && user?.role === 'artist') {
      // Artists can only access /admin/artists
      const allowedPrefix = `/${locale}/admin/artists`;
      const isDashboard = pathname === `/${locale}/admin`;
      
      if (!pathname.startsWith(allowedPrefix)) {
        if (isDashboard) {
          router.replace(allowedPrefix);
        } else {
          router.replace(allowedPrefix);
        }
      }
    }
  }, [isAuthenticated, loading, router, locale, user, pathname]);

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
