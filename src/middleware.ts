import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const LOCALE_COOKIE = 'NEXT_LOCALE'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Get locale from cookie or fall back to default
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
  const locale = cookieLocale && (routing.locales as unknown as string[]).includes(cookieLocale)
    ? (cookieLocale as 'th' | 'en')
    : routing.defaultLocale

  // Pass locale to RSC via request headers (NOT response headers!)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('X-NEXT-INTL-LOCALE', locale)

  const response = NextResponse.next({ request: { headers: requestHeaders } })

  // Also set cookie for subsequent browser requests
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
