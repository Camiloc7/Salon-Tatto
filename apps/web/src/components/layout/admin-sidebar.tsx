'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  Users,
  FileText,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  Mail,
  Tags,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-provider';

const navItems = [
  { href: '/admin', labelKey: 'sidebar.dashboard', icon: LayoutDashboard },
  { href: '/admin/artists', labelKey: 'sidebar.artists', icon: Users },
  { href: '/admin/promotions', labelKey: 'sidebar.promotions', icon: Megaphone },
  { href: '/admin/blog', labelKey: 'sidebar.blog', icon: FileText },
  { href: '/admin/categories', labelKey: 'sidebar.categories', icon: Tags },
  { href: '/admin/faq', labelKey: 'sidebar.faq', icon: FileText },
  { href: '/admin/seo', labelKey: 'sidebar.seo', icon: Search },
  { href: '/admin/messages', labelKey: 'sidebar.messages', icon: Mail },
  { href: '/admin/users', labelKey: 'sidebar.users', icon: Users },
  { href: '/admin/settings', labelKey: 'sidebar.settings', icon: Settings },
  { href: '/admin/studio-page', labelKey: 'sidebar.studioPage', icon: FileText },
  { href: '/admin/profile', labelKey: 'sidebar.profile', icon: User },
];

export function AdminSidebar() {
  const t = useTranslations('admin');
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [collapsed, setCollapsed] = useState(false);

  const locale = pathname.split('/')[1];
  const isActive = (href: string) => {
    const adminPath = `/${locale}${href}`;
    if (href === '/admin') return pathname === adminPath;
    return pathname.startsWith(adminPath);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className={cn("flex items-center py-5 transition-all", collapsed ? "justify-center px-2" : "gap-2 px-6")}>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center relative">
          <Image src="/LR.png" alt="Logo" fill className="object-contain" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-lg whitespace-nowrap overflow-hidden">
            {t('sidebar.dashboard') ? 'La Rola Tattoo' : 'Admin'}
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 mt-4">
        {navItems
          .filter((item) => {
            if (user?.role === 'artist') {
              return item.href === '/admin/artists';
            }
            return true;
          })
          .map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center rounded-lg py-2 transition-all group',
                collapsed ? 'justify-center px-2' : 'gap-3 px-3',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
              title={collapsed ? t(item.labelKey) : undefined}
            >
              <Icon className={cn("shrink-0", collapsed ? "h-5 w-5" : "h-4 w-4")} />
              {!collapsed && <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
                {t(item.labelKey)}
              </span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3 space-y-2">
        <button
          onClick={logout}
          className={cn(
            "flex w-full items-center rounded-lg py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
            collapsed ? "justify-center px-2" : "gap-3 px-3"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className={cn("shrink-0", collapsed ? "h-5 w-5" : "h-4 w-4")} />
          {!collapsed && <span className="text-sm font-medium whitespace-nowrap overflow-hidden">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-background shadow-md border md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 border-r bg-background transition-all duration-300 md:relative md:translate-x-0',
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64',
          !mobileOpen && collapsed ? 'md:w-20' : 'md:w-64'
        )}
      >
        {sidebarContent}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute -right-3 top-6 h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm text-muted-foreground hover:text-foreground hover:bg-accent z-50 transition-colors"
          title={collapsed ? "Expandir" : "Colapsar"}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>
    </>
  );
}
