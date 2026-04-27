import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale from getRequestConfig may not read middleware-set headers properly
  // in Next.js 14, so we read the locale from the cookie directly
  const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value
  const locale = await requestLocale
  const resolvedLocale = (cookieLocale && routing.locales.includes(cookieLocale as 'th' | 'en'))
    ? (cookieLocale as 'th' | 'en')
    : (locale && routing.locales.includes(locale as 'th' | 'en'))
    ? (locale as 'th' | 'en')
    : routing.defaultLocale
  return {
    locale: resolvedLocale,
    messages: (await import(`../locales/${resolvedLocale}.json`)).default,
  }
})
