import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  // Si deseas que la app detecte el idioma del navegador automáticamente,
  // cambia la siguiente línea a: localeDetection: true,
  localeDetection: false,
});

// Los Server Actions de Next.js usan IDs hexadecimales largos. Cualquier otro
// valor (p. ej. "x") es un escaneo automatizado; lo cortamos aquí para no
// llenar los logs con "Failed to find Server Action".
const SERVER_ACTION_ID = /^[0-9a-f]{32,}$/i;

export default function middleware(request: NextRequest) {
  const actionId = request.headers.get('next-action');

  if (actionId && !SERVER_ACTION_ID.test(actionId)) {
    return new NextResponse(null, { status: 400 });
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
