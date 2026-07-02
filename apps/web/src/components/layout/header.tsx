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
  { href: '/studio', labelKey: 'nav.studio' },
  { href: '/artists', labelKey: 'nav.artists' },
  { href: '/gallery', labelKey: 'nav.gallery' },
  { href: '/blog', labelKey: 'nav.blog' },
  { href: '/contact', labelKey: 'nav.contact' },
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
      <div className="container flex h-14 items-center justify-between">
        {/* LOGO ORIGINAL EN SU LUGAR */}
        <Link
          href={`/${locale}`}
          aria-hidden="true"
          tabIndex={-1}
          className="flex items-center gap-3 text-xl font-bold tracking-tight shrink-0 hover:opacity-90 transition-opacity"
        >
          {/* LOGO NUEVO (Imagen WebP) */}
          <div className="relative h-12 w-12 sm:h-14 sm:w-14">
            <Image src="/LR.webp" alt="Logo" fill className="object-contain" />
          </div>

          {/* LOGO ANTERIOR (Máscara SVG Dorado) - Descomentar para restaurar */}
          {/*
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded overflow-hidden bg-primary shadow-sm">
            <div className="absolute inset-0 bg-background [mask-image:url(/logo.svg)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]" />
          </div>
          */}
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
