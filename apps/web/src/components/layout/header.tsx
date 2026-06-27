'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MobileNav } from '@/components/layout/mobile-nav';

const navLinks = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/estudio', labelKey: 'nav.studio' },
  { href: '/artistas', labelKey: 'nav.artists' },
  { href: '/galeria', labelKey: 'nav.gallery' },
  { href: '/blog', labelKey: 'nav.blog' },
  { href: '/contacto', labelKey: 'nav.contact' },
] as const;

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const alternateLocale = locale === 'en' ? 'es' : 'en';
  const localizedPath = pathname.replace(`/${locale}`, `/${alternateLocale}`);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-xl font-bold tracking-tight shrink-0"
        >
          <img src="/Logo.webp" alt="Logo" className="h-10 w-auto max-w-[120px] object-contain" />
          <span className="hidden sm:inline-block truncate">{t('site.name')}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const fullHref = `/${locale}${link.href === '/' ? '' : link.href}`;
            const isActive = pathname === fullHref;
            return (
              <Link
                key={link.href}
                href={fullHref}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {t(link.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={localizedPath}
            className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="uppercase">{alternateLocale}</span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label={t('actions.close')}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
