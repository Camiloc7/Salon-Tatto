'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { api } from '@/lib/api-client';
import { useEffect, useState } from 'react';
import type { StudioSettings } from '@salon-tatto/shared';

import { motion } from 'framer-motion';

export function WhatsAppButton() {
  const [whatsapp, setWhatsapp] = useState('+1234567890'); // Fallback number

  useEffect(() => {
    api
      .get<StudioSettings>('/settings')
      .then((settings) => {
        if (settings.whatsapp) setWhatsapp(settings.whatsapp);
      })
      .catch(() => {});
  }, []);

  const phone = whatsapp.replace(/[^0-9]/g, '');
  const message = encodeURIComponent("Hi! I'd like to book an appointment. Here's my tattoo idea and reference photo. Could you recommend the best artist for my project?");
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40"
      aria-label="Chat on WhatsApp"
    >
      <motion.div
        animate={{
          scale: [1, 1.15, 1, 1.2, 1, 1, 1.1, 1, 1],
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          times: [0, 0.1, 0.2, 0.3, 0.4, 0.7, 0.8, 0.9, 1],
          ease: "easeInOut"
        }}
        whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 0.3 } }}
        whileTap={{ scale: 0.9 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 border border-primary/50 text-primary shadow-[0_0_20px_hsl(var(--primary)/0.15)] transition-colors hover:bg-black hover:border-primary hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
      >
        <MessageCircle className="h-8 w-8" />
      </motion.div>
    </Link>
  );
}
