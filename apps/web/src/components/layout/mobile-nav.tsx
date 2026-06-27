'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/estudio', labelKey: 'nav.studio' },
  { href: '/artistas', labelKey: 'nav.artists' },
  { href: '/galeria', labelKey: 'nav.gallery' },
  { href: '/blog', labelKey: 'nav.blog' },
  { href: '/contacto', labelKey: 'nav.contact' },
] as const;

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();

  const alternateLocale = locale === 'en' ? 'es' : 'en';
  const localizedPath = pathname.replace(`/${locale}`, `/${alternateLocale}`);

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-background p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold flex items-center gap-2">
              <img src="/Logo.webp" alt="Logo" className="h-8 w-auto max-w-[120px] object-contain" />
              {t('site.name')}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label={t('actions.close')}
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <nav className="mt-8 flex flex-col gap-4">
            {navLinks.map((link) => {
              const fullHref = `/${locale}${link.href === '/' ? '' : link.href}`;
              const isActive = pathname === fullHref;
              return (
                <Link
                  key={link.href}
                  href={fullHref}
                  onClick={onClose}
                  className={cn(
                    'text-lg font-medium transition-colors hover:text-primary',
                    isActive ? 'text-primary' : 'text-foreground',
                  )}
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
            <Link
              href={localizedPath}
              onClick={onClose}
              className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="uppercase">{alternateLocale}</span>
            </Link>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
