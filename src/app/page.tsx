'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/context'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Check, ArrowRight, Zap } from 'lucide-react'

export default function LandingPage() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-white text-stone-900">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-stone-200">
        <div className="container-lg mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-stone-900">PortGen</span>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100"
            onClick={() => {
              const menu = document.getElementById('mobile-menu')
              if (menu) menu.classList.toggle('hidden')
            }}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
              {t.nav.features}
            </a>
            <a href="#pricing" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
              {t.nav.pricing}
            </a>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link href="/login" className="btn-ghost text-sm">
              {t.nav.login}
            </Link>
            <Link href="/login" className="btn-primary text-sm bg-amber-500 hover:bg-amber-600 text-white">
              {t.nav.getStarted}
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        <div id="mobile-menu" className="hidden md:hidden border-t border-stone-200 px-6 py-4 space-y-3">
          <a href="#features" className="block text-sm text-stone-600 hover:text-stone-900"> {t.nav.features}</a>
          <a href="#pricing" className="block text-sm text-stone-600 hover:text-stone-900"> {t.nav.pricing}</a>
          <div className="flex items-center gap-3 pt-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <Link href="/login" className="btn-ghost text-sm w-full justify-center">{t.nav.login}</Link>
          <Link href="/login" className="btn-primary text-sm bg-amber-500 hover:bg-amber-600 text-white w-full justify-center">{t.nav.getStarted}</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="section bg-gradient-to-b from-white to-teal-50">
        <div className="container mx-auto text-center max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100 text-sm text-teal-700 mb-8 border border-teal-200">
            <Check className="w-3.5 h-3.5 text-teal-600" />
            <span>{t.hero.badge}</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 mb-6 leading-[1.1]">
            {t.hero.title}
            <br />
            <span className="text-teal-600">{t.hero.titleHighlight}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-stone-500 max-w-xl mx-auto mb-10 leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login" className="btn-primary text-base px-7 py-3">
              {t.hero.createFree}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="#features" className="btn-secondary text-base px-7 py-3">
              {t.hero.browseThemes}
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-16 flex flex-col items-center gap-2">
            <p className="text-sm text-stone-400">{t.hero.socialProof}</p>
            <p className="text-xs text-stone-300">{t.hero.fromText}</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section bg-stone-50">
        <div className="container-lg mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 mb-3">{t.features.title}</h2>
            <p className="text-stone-500 text-base max-w-lg mx-auto">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                title: t.features.items.themes.title,
                desc: t.features.items.themes.desc,
              },
              {
                title: t.features.items.semiCode.title,
                desc: t.features.items.semiCode.desc,
              },
              {
                title: t.features.items.fast.title,
                desc: t.features.items.fast.desc,
              },
              {
                title: t.features.items.hosting.title,
                desc: t.features.items.hosting.desc,
              },
              {
                title: t.features.items.github.title,
                desc: t.features.items.github.desc,
              },
              {
                title: t.features.items.export.title,
                desc: t.features.items.export.desc,
              },
            ].map((feature, i) => (
              <div key={i} className="card p-6">
                <h3 className="text-base font-semibold text-stone-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section">
        <div className="container-lg mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 mb-3">{t.pricing.title}</h2>
            <p className="text-stone-500 text-base max-w-lg mx-auto">
              {t.pricing.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* Free */}
            <div className="card p-8">
              <div className="text-sm font-medium text-stone-500 mb-1">{t.pricing.free}</div>
              <div className="text-4xl font-bold tracking-tight text-stone-900 mb-1">
                $0<span className="text-lg font-normal text-stone-400">/{t.pricing.perMonth}</span>
              </div>
              <div className="text-stone-400 text-sm mb-7">{t.pricing.foreverFree}</div>

              <ul className="space-y-3 mb-8">
                {[
                  t.pricing.features.portfolio,
                  t.pricing.features.themes3,
                  t.pricing.features.subdomain,
                  t.pricing.features.basicCustom,
                  t.pricing.features.exportHtml,
                  t.pricing.features.community,
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-stone-600">
                    <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/login" className="btn-secondary w-full justify-center">
                {t.pricing.getStarted}
              </Link>
            </div>

            {/* Pro */}
            <div className="card p-8 border-teal-200 relative shadow-teal-100">
              <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-xs font-semibold text-white shadow-sm">
                {t.pricing.popular}
              </div>

              <div className="text-sm font-semibold text-teal-700 mb-1">{t.pricing.pro}</div>
              <div className="text-4xl font-bold tracking-tight text-stone-900 mb-1">
                $5<span className="text-lg font-normal text-stone-400">/{t.pricing.perMonth}</span>
              </div>
              <div className="text-stone-400 text-sm mb-7">{t.pricing.billedMonthly}</div>

              <ul className="space-y-3 mb-8">
                {[
                  t.pricing.features.unlimited,
                  t.pricing.features.themes15,
                  t.pricing.features.customDomain,
                  t.pricing.features.removeBranding,
                  t.pricing.features.analytics,
                  t.pricing.features.priority,
                  t.pricing.features.earlyAccess,
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-stone-600">
                    <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/login" className="btn-primary w-full justify-center">
                {t.pricing.startProTrial}
              </Link>
              <p className="text-center text-xs text-stone-400 mt-3">
                {t.pricing.cancelAnytime}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-to-br from-teal-600 to-teal-700 text-white">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight mb-4">{t.cta.title}</h2>
          <p className="text-teal-100 text-base mb-9">
            {t.cta.subtitle}
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-white text-teal-700 font-semibold text-base hover:bg-teal-50 transition-colors shadow-lg">
            {t.cta.button}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-stone-200">
        <div className="container-lg mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-teal-600" />
            <span className="font-semibold text-sm text-stone-500">PortGen</span>
          </div>
          <p className="text-stone-400 text-sm">
            {t.footer.copyright}
          </p>
        </div>
      </footer>
    </div>
  )
}
