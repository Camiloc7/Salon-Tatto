import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import PromotionBanner, { type Promotion } from '@/components/PromotionBanner';
import { api } from '@/lib/api-client';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'La Rola Tattoo NYC | Premium Studio',
  description: 'Estudio de tatuajes boutique, arte personalizado y exclusivo.',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  let promotion: Promotion | null = null;
  try {
    const data = await api.get<Promotion>('/promotions/active', { 
      next: { revalidate: 300, tags: ['promotions'] } 
    });
    if (data && data.isActive) {
      promotion = data;
    }
  } catch (error) {
    // Si da 404 porque no hay promociones activas, lo ignoramos en silencio aquí (servidor)
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <PromotionBanner promotion={promotion} />
        {children}
      </body>
    </html>
  );
}
