import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Instagram, Facebook, Music2 } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { StudioSettings } from '@salon-tatto/shared';

const footerNav = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/estudio', labelKey: 'nav.studio' },
  { href: '/artistas', labelKey: 'nav.artists' },
  { href: '/galeria', labelKey: 'nav.gallery' },
  { href: '/blog', labelKey: 'nav.blog' },
  { href: '/contacto', labelKey: 'nav.contact' },
] as const;

async function getSettings(): Promise<StudioSettings | null> {
  try {
    return await api.get<StudioSettings>('/settings/studio', {
      next: { revalidate: 300 },
    });
  } catch {
    return null;
  }
}

export async function Footer() {
  const t = await getTranslations();
  const settings = await getSettings();

  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{t('site.name')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('site.description')}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider">
              {t('nav.home')}
            </h4>
            <ul className="space-y-2">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider">
              {t('footer.contactInfo')}
            </h4>
            {settings && (
              <ul className="space-y-2 text-sm text-muted-foreground">
                {settings.address && <li>{settings.address}</li>}
                {settings.phone && <li>{settings.phone}</li>}
                {settings.email && <li>{settings.email}</li>}
              </ul>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider">
              {t('footer.followUs')}
            </h4>
            <div className="flex gap-3">
              {settings?.instagram && (
                <Link
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              )}
              {settings?.facebook && (
                <Link
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
              )}
              {settings?.tiktok && (
                <Link
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Music2 className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-muted-foreground/20 pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {t('site.name')}. {t('footer.rights')}.
        </div>
      </div>
    </footer>
  );
}
