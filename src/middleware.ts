import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from '@/types/locale';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

