import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import { headers } from 'next/headers'

export default getRequestConfig(async () => {
  const headersList = await headers()
  const locale = headersList.get('x-locale') ?? routing.defaultLocale
  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  }
})
