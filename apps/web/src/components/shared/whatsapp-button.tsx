'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { api } from '@/lib/api-client';
import { useEffect, useState } from 'react';
import type { StudioSettings } from '@salon-tatto/shared';

export function WhatsAppButton() {
  const [whatsapp, setWhatsapp] = useState('+1234567890'); // Fallback number

  useEffect(() => {
    api
      .get<StudioSettings>('/settings/studio')
      .then((settings) => {
        if (settings.whatsapp) setWhatsapp(settings.whatsapp);
      })
      .catch(() => {});
  }, []);

  const phone = whatsapp.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${phone}`;

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 border border-amber-500/50 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all hover:bg-black hover:border-amber-400 hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </Link>
  );
}
