import './globals.css'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/components/AuthProvider'
import { NextIntlClientProvider } from 'next-intl'
import { LocaleProvider } from '@/components/LocaleProvider'
import { routing } from '@/i18n/routing'

const BASE_URL = 'https://portgen.com'

export async function generateMetadata(): Promise<Metadata> {
  const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value
  const locale = (cookieLocale && routing.locales.includes(cookieLocale as 'th' | 'en'))
    ? (cookieLocale as 'th' | 'en')
    : routing.defaultLocale
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: 'PortGen — Free Portfolio Generator for Developers',
      template: '%s | PortGen',
    },
    description: 'Create a stunning developer portfolio in minutes. Free to start, no credit card required.',
    keywords: ['portfolio generator', 'developer portfolio', 'free portfolio', 'portfolio website', 'web developer portfolio', 'portfolio builder'],
    authors: [{ name: 'PortGen' }],
    creator: 'PortGen',
    openGraph: {
      type: 'website',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      url: BASE_URL,
      siteName: 'PortGen',
      title: 'PortGen — Free Portfolio Generator for Developers',
      description: 'Create a stunning developer portfolio in minutes. Free to start, no credit card required.',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'PortGen — Free Portfolio Generator for Developers',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'PortGen — Free Portfolio Generator for Developers',
      description: 'Create a stunning developer portfolio in minutes. Free to start, no credit card required.',
      images: ['/og-image.png'],
      creator: '@portgen',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.svg',
      apple: '/apple-touch-icon.png',
    },
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://portgen.com/#organization',
      name: 'PortGen',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/favicon.svg`,
      },
      sameAs: [
        'https://twitter.com/portgen',
        'https://github.com/portgen',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://portgen.com/#website',
      url: BASE_URL,
      name: 'PortGen',
      publisher: { '@id': 'https://portgen.com/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/dashboard?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/`,
      url: `${BASE_URL}/`,
      name: 'PortGen — Free Portfolio Generator for Developers',
      isPartOf: { '@id': 'https://portgen.com/#website' },
      about: { '@id': 'https://portgen.com/#organization' },
      description: 'Create a stunning developer portfolio in minutes. Free to start, no credit card required.',
    },
  ],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value
  const locale = (cookieLocale && routing.locales.includes(cookieLocale as 'th' | 'en'))
    ? (cookieLocale as 'th' | 'en')
    : routing.defaultLocale

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Thai:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var c = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
                  var cookieLocale = c ? c[1] : null;
                  var ls = localStorage.getItem('portgen_locale');
                  if (cookieLocale && cookieLocale !== ls) {
                    localStorage.setItem('portgen_locale', cookieLocale);
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale}>
          <LocaleProvider>
            <ThemeProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
          </LocaleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
