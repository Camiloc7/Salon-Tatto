import type { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import PromotionBanner, { type Promotion } from '@/components/PromotionBanner';
import { api } from '@/lib/api-client';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const viewport: Viewport = {
  themeColor: '#000000',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.WEB_URL || 'https://larolatattoonyc.com'),
  title: {
    template: '%s | La Rola Tattoo NYC',
    default: 'La Rola Tattoo NYC | Custom Tattoo Studio',
  },
  description: 'Custom Tattoo Studio in Midtown Manhattan, NYC. Specializing in Fine Line, Black & Grey, Color, Ornamental, and Cover-Up tattoos.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'La Rola Tattoo NYC',
    title: 'La Rola Tattoo NYC | Custom Tattoo Studio',
    description: 'Custom Tattoo Studio in Midtown Manhattan, NYC. Specializing in Fine Line, Black & Grey, Color, Ornamental, and Cover-Up tattoos.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Rola Tattoo NYC | Custom Tattoo Studio',
    description: 'Custom Tattoo Studio in Midtown Manhattan, NYC. Specializing in Fine Line, Black & Grey, Color, Ornamental, and Cover-Up tattoos.',
  }
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
