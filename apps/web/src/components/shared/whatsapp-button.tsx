'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { api } from '@/lib/api-client';
import { useEffect, useState } from 'react';
import type { StudioSettings } from '@salon-tatto/shared';

export function WhatsAppButton() {
  const [whatsapp, setWhatsapp] = useState('');

  useEffect(() => {
    api
      .get<StudioSettings>('/settings/studio')
      .then((settings) => setWhatsapp(settings.whatsapp))
      .catch(() => {});
  }, []);

  if (!whatsapp) return null;

  const phone = whatsapp.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${phone}`;

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-colors hover:bg-green-600"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </Link>
  );
}
