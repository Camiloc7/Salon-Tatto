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
    return await api.get<StudioSettings>('/settings', {
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
    <footer className="bg-black border-t border-zinc-900 text-zinc-400">
      <div className="container max-w-5xl mx-auto px-6 py-20 flex flex-col items-center text-center">

        {/* Top: Social Media */}
        <div className="flex gap-8 mb-16">
          <Link
            href={settings?.instagram || "https://instagram.com"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-primary hover:bg-primary/10 transition-all duration-300"
          >
            <Instagram className="h-5 w-5" />
          </Link>
          <Link
            href={settings?.facebook || "https://facebook.com"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-primary hover:bg-primary/10 transition-all duration-300"
          >
            <Facebook className="h-5 w-5" />
          </Link>
          <Link
            href={settings?.tiktok || "https://tiktok.com"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-primary hover:bg-primary/10 transition-all duration-300"
          >
            <Music2 className="h-5 w-5" />
          </Link>
        </div>

        {/* Middle: Brand & Navigation */}
        <div className="mb-12">
          <Link href="/" className="inline-flex flex-col items-center gap-6 mb-8 group">
            {/* <div className="relative h-16 w-16 rounded overflow-hidden bg-primary shadow-sm transition-opacity duration-300 group-hover:opacity-90">
              <div className="absolute inset-0 bg-black [mask-image:url(/logo.svg)] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]" />
            </div> */}
            <h2 className="text-3xl font-serif tracking-widest text-white uppercase font-light group-hover:text-primary transition-colors duration-300">
              {settings?.studioName || t('site.name')}
            </h2>
          </Link>
          <ul className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            {footerNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[11px] uppercase tracking-[0.2em] font-medium text-zinc-500 hover:text-white transition-colors"
                >
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info (if available) */}
        {settings && (
          <div className="flex flex-col md:flex-row gap-4 md:gap-10 text-[11px] uppercase tracking-widest text-zinc-600 mb-16">
            {settings.email && <span>{settings.email}</span>}
            {settings.phone && <span className="hidden md:inline">•</span>}
            {settings.phone && <span>{settings.phone}</span>}
            {settings.address && <span className="hidden md:inline">•</span>}
            {settings.address && <span>{settings.address}</span>}
          </div>
        )}

        {/* Credentials Section */}
        <div className="mb-16 flex flex-col items-center gap-2 text-primary/70 text-sm font-light leading-relaxed">
          <h3 className="text-primary font-medium uppercase tracking-widest text-xs mb-2">Professional Credentials</h3>
          <p>NYC Health Department Licensed ({settings?.licenseNumber || '#50107542'})</p>
          <p>Valid: {settings?.licenseDates || '01/07/2025 - 12/31/2026'}</p>
          <p>Bloodborne Pathogen Training</p>
          <p>First Aid & CPR Certified</p>
          <p>Sterile Equipment & Safety</p>
          <a
            href="https://portal.311.nyc.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-xs uppercase tracking-widest underline hover:text-primary/80 transition-colors"
          >
            Verify License Online (NYC 311)
          </a>
        </div>

        {/* Bottom: Copyright */}
        <div className="w-full border-t border-zinc-900 pt-8 text-[10px] uppercase tracking-widest text-zinc-700">
          &copy; {new Date().getFullYear()} {settings?.studioName || t('site.name')}. {t('footer.rights')}.
        </div>
      </div>
    </footer>
  );
}
