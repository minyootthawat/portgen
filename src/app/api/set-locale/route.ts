import { NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'

const LOCALE_COOKIE = 'NEXT_LOCALE'

export async function POST(request: Request) {
  let locale = routing.defaultLocale
  try {
    const body = await request.json()
    if (body.locale && (routing.locales as unknown as string[]).includes(body.locale as string)) {
      locale = body.locale
    }
  } catch {
    // ignore parse errors
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
  return response
}
