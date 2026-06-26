import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import PromotionBanner from '@/components/PromotionBanner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'La Rola Tattoo NYC | Premium Studio',
  description: 'Estudio de tatuajes boutique, arte personalizado y exclusivo.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <PromotionBanner />
        {children}
      </body>
    </html>
  );
}
