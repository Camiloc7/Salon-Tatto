'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const t = useTranslations();
  
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center text-center px-4 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-50 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30 z-0 mix-blend-overlay pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        <h1 className="text-glow text-7xl font-black text-white md:text-9xl tracking-tighter drop-shadow-2xl">404</h1>
        <h2 className="text-2xl font-bold text-gray-200 md:text-3xl tracking-tight">Página no encontrada</h2>
        <p className="text-gray-400 max-w-md mx-auto text-lg font-light">
          Parece que te has perdido. Esta página no existe en nuestro estudio, pero de seguro tenemos el tatuaje perfecto para ti.
        </p>
        <div className="pt-8">
          <Link href="/">
            <Button size="lg" className="h-14 px-8 text-lg font-semibold shadow-[0_0_20px_rgba(225,29,72,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(225,29,72,0.8)]">
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
