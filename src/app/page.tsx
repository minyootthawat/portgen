'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useI18n } from '@/i18n/context'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { ThemeToggle } from '@/components/ThemeToggle'
import { AuthDialog } from '@/components/AuthDialog'
import { Check, ArrowRight, Zap, Play, Star, Users, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  const { t } = useI18n()
  const [authOpen, setAuthOpen] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)
  const sectionsRef = useRef<HTMLDivElement>(null)

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    const revealEls = document.querySelectorAll('.reveal, .reveal-stagger')
    revealEls.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleTryDemo = () => {
    // Set up demo session in localStorage
    const demoUser = {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Demo User',
      email: 'demo@portgen.dev',
      tagline: 'Full-Stack Developer | React & Node.js',
      about: 'Passionate developer with 5 years of experience building web applications. I love creating beautiful, user-friendly interfaces and scalable backends.',
      skills: [
        { id: '1', name: 'React' },
        { id: '2', name: 'TypeScript' },
        { id: '3', name: 'Node.js' },
        { id: '4', name: 'PostgreSQL' },
        { id: '5', name: 'Docker' },
        { id: '6', name: 'GraphQL' },
      ],
      projects: [
        {
          id: '1',
          title: 'E-Commerce Platform',
          description: 'Full-stack marketplace with React, Node.js, Stripe payments, and real-time inventory management. Serves 2,000+ daily active users.',
          tags: ['React', 'Node.js', 'Stripe', 'PostgreSQL'],
          live_url: 'https://demo-shop.vercel.app',
          repo_url: 'https://github.com/demo/ecommerce',
        },
        {
          id: '2',
          title: 'Task Management App',
          description: 'Real-time collaboration tool with WebSocket sync, Kanban boards, and team analytics dashboard.',
          tags: ['Next.js', 'WebSocket', 'Prisma'],
          live_url: 'https://demo-taskapp.vercel.app',
          repo_url: 'https://github.com/demo/taskapp',
        },
        {
          id: '3',
          title: 'AI Writing Assistant',
          description: 'GPT-4 powered writing tool with SEO analysis, tone adjustment, and multi-language support.',
          tags: ['OpenAI', 'Python', 'FastAPI'],
          live_url: 'https://demo-aiwrite.vercel.app',
          repo_url: 'https://github.com/demo/aiwrite',
        },
        {
          id: '4',
          title: 'Fitness Tracking Dashboard',
          description: 'Health metrics visualization app with wearable device integration and personalized workout recommendations.',
          tags: ['React', 'D3.js', 'Node.js'],
          live_url: 'https://demo-fitness.vercel.app',
          repo_url: 'https://github.com/demo/fitness',
        },
      ],
      social_links: [
        { id: '1', platform: 'github', url: 'https://github.com/demouser' },
        { id: '2', platform: 'linkedin', url: 'https://linkedin.com/in/demouser' },
        { id: '3', platform: 'twitter', url: 'https://twitter.com/demouser' },
      ],
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    }
    localStorage.setItem('demo_session', JSON.stringify(demoUser))
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100" ref={sectionsRef}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700">
        <div className="container-lg mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-stone-900 dark:text-white">PortGen</span>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800"
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
            <a href="#features" className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
              {t.nav.features}
            </a>
            <a href="#pricing" className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
              {t.nav.pricing}
            </a>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <button onClick={() => setDemoOpen(true)} className="btn-ghost text-sm dark:text-stone-300">
              {t.nav.login}
            </button>
            <button onClick={() => setAuthOpen(true)} className="btn-primary text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-sm">
              {t.nav.getStarted}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div id="mobile-menu" className="hidden md:hidden border-t border-stone-200 dark:border-stone-700 px-6 py-4 space-y-3">
          <a href="#features" className="block text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"> {t.nav.features}</a>
          <a href="#pricing" className="block text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"> {t.nav.pricing}</a>
          <div className="flex items-center gap-3 pt-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <button onClick={() => setDemoOpen(true)} className="btn-ghost text-sm w-full justify-center">{t.nav.login}</button>
          <button onClick={() => setAuthOpen(true)} className="btn-primary text-sm bg-teal-600 hover:bg-teal-700 text-white w-full justify-center">{t.nav.getStarted}</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="section bg-gradient-to-b from-white dark:from-stone-900 to-teal-50 dark:to-teal-950 relative overflow-hidden">
        {/* Floating social proof badge */}
        <div className="absolute top-24 right-6 lg:right-12 animate-fade-in z-10 hidden md:block" style={{ animationDelay: '0.8s', opacity: 0 }}>
          <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3">
            <div className="flex -space-x-2">
              {['👩‍💻', '👨‍💻', '👩‍🎨'].map((e, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-700 border-2 border-white dark:border-stone-800 flex items-center justify-center text-sm">
                  {e}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm font-semibold text-stone-900 dark:text-white">
                <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                3 portfolios created today
              </div>
              <div className="text-xs text-stone-400">Join them — it takes 5 min</div>
            </div>
          </div>
        </div>

        <div className="container mx-auto text-center max-w-3xl relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-sm text-teal-700 dark:text-teal-300 mb-8 border border-teal-200 dark:border-teal-800 animate-fade-in-up">
            <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{t.hero.badge}</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 dark:text-white mb-6 leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            {t.hero.title}
            <br />
            <span className="text-teal-600 dark:text-teal-400">{t.hero.titleHighlight}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-stone-500 dark:text-stone-400 max-w-xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            {t.hero.subtitle}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <button onClick={() => setAuthOpen(true)} className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/30">
              {t.hero.createFree}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => setDemoOpen(true)} className="btn-secondary text-base px-8 py-3.5">
              <Play className="w-4 h-4" />
              Watch Demo
            </button>
          </div>

          {/* Mini portfolio preview */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
            <p className="text-xs text-stone-400 dark:text-stone-500 mb-3 uppercase tracking-widest">What your portfolio looks like →</p>
            <div className="max-w-lg mx-auto rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-2xl shadow-stone-900/10">
              {/* Browser chrome */}
              <div className="px-4 py-2.5 bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-stone-200 dark:bg-stone-700 rounded px-3 py-0.5 text-xs text-stone-400 dark:text-stone-400 text-center font-mono">
                    demouser.portgen.com
                  </div>
                </div>
              </div>
              {/* Portfolio preview content */}
              <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 p-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-gradient-to-br from-sky-400 to-indigo-500 shadow-lg" />
                  <h3 className="text-lg font-bold text-white mb-1">Demo User</h3>
                  <p className="text-slate-400 text-xs mb-4">Full-Stack Developer | React & Node.js</p>
                  <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                    {['React', 'TypeScript', 'Node.js', 'GraphQL', '+2'].map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-xs">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  {['E-Commerce Platform', 'Task Management App'].map((p) => (
                    <div key={p} className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs font-medium text-white">{p}</div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate">Full-stack marketplace with React & Node.js...</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Social proof */}
          <div className="mt-14 flex flex-col items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.7s', opacity: 0 }}>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm text-stone-400 dark:text-stone-500">{t.hero.socialProof}</p>
          </div>
        </div>
      </section>

      {/* Watch Demo Section */}
      <section className="section-sm bg-stone-50 dark:bg-stone-800/50 reveal">
        <div className="container-lg mx-auto">
          <div className="text-center reveal">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">See it in action</h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm mb-8">Watch how easy it is to build your portfolio in under 5 minutes</p>
          </div>
          <div className="max-w-3xl mx-auto">
            {/* Video placeholder */}
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-xl aspect-video bg-stone-200 dark:bg-stone-800 group cursor-pointer" onClick={() => setDemoOpen(true)}>
              {/* Thumbnail background */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-indigo-700" />
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Play button */}
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-200 animate-pulse-glow">
                  <Play className="w-7 h-7 text-white fill-white ml-1" />
                </div>
              </div>
              {/* Overlay text */}
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white/90 text-sm font-medium">Watch the full demo — 3 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section bg-white dark:bg-stone-900">
        <div className="container-lg mx-auto">
          <div className="text-center mb-14 reveal">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white mb-3">{t.features.title}</h2>
            <p className="text-stone-500 dark:text-stone-400 text-base max-w-lg mx-auto">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 reveal-stagger">
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
              <div key={i} className="card card-hover p-6">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-4">
                  <Check className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-base font-semibold text-stone-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-stone-50 dark:bg-stone-800/50">
        <div className="container-lg mx-auto">
          <div className="text-center mb-14 reveal">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white mb-3">
              {t.testimonials.title}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto reveal-stagger">
            {t.testimonials.items.map((item, i) => (
              <div key={i} className="card card-hover p-6 border border-stone-200 dark:border-stone-700">
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-stone-700 dark:text-stone-200 text-sm leading-relaxed mb-4 italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <p className="text-xs text-stone-400 dark:text-stone-500 font-medium">
                  — {item.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-10 bg-teal-600 dark:bg-teal-700 reveal">
        <div className="container-lg mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '2,000+', label: 'Portfolios created' },
              { value: '4.9/5', label: 'Average rating' },
              { value: '< 5 min', label: 'Average build time' },
              { value: 'Free', label: 'To get started' },
            ].map((stat, i) => (
              <div key={i} className="reveal">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-teal-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section bg-white dark:bg-stone-900">
        <div className="container-lg mx-auto">
          <div className="text-center mb-14 reveal">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white mb-3">{t.pricing.title}</h2>
            <p className="text-stone-500 dark:text-stone-400 text-base max-w-lg mx-auto">
              {t.pricing.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto reveal-stagger">
            {/* Free */}
            <div className="card card-hover p-8">
              <div className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-1">{t.pricing.free}</div>
              <div className="text-4xl font-bold tracking-tight text-stone-900 dark:text-white mb-1">
                $0<span className="text-lg font-normal text-stone-400 dark:text-stone-500">/{t.pricing.perMonth}</span>
              </div>
              <div className="text-stone-400 dark:text-stone-500 text-sm mb-7">{t.pricing.foreverFree}</div>

              <ul className="space-y-3 mb-8">
                {[
                  t.pricing.features.portfolio,
                  t.pricing.features.themes3,
                  t.pricing.features.subdomain,
                  t.pricing.features.basicCustom,
                  t.pricing.features.exportHtml,
                  t.pricing.features.community,
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-stone-600 dark:text-stone-300">
                    <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button onClick={() => setAuthOpen(true)} className="btn-secondary w-full justify-center">
                {t.pricing.getStarted}
              </button>
            </div>

            {/* Pro */}
            <div className="card card-hover p-8 border-teal-200 dark:border-teal-800 relative shadow-lg shadow-teal-600/10">
              <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-xs font-semibold text-white shadow-sm">
                {t.pricing.popular}
              </div>

              <div className="text-sm font-semibold text-teal-700 dark:text-teal-300 mb-1">{t.pricing.pro}</div>
              <div className="text-4xl font-bold tracking-tight text-stone-900 dark:text-white mb-1">
                $5<span className="text-lg font-normal text-stone-400 dark:text-stone-500">/{t.pricing.perMonth}</span>
              </div>
              <div className="text-stone-400 dark:text-stone-500 text-sm mb-7">{t.pricing.billedMonthly}</div>

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
                  <li key={i} className="flex items-center gap-3 text-sm text-stone-600 dark:text-stone-300">
                    <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button onClick={() => setAuthOpen(true)} className="btn-primary w-full justify-center shadow-md">
                {t.pricing.startProTrial}
              </button>
              <p className="text-center text-xs text-stone-400 dark:text-stone-500 mt-3">
                {t.pricing.cancelAnytime}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-to-br from-teal-600 dark:from-teal-700 to-teal-700 dark:to-teal-800 text-white dark:text-teal-50 reveal">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight mb-4">{t.cta.title}</h2>
          <p className="text-teal-100 dark:text-teal-200 text-base mb-9">
            {t.cta.subtitle}
          </p>
          <button onClick={() => setAuthOpen(true)} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-white dark:bg-teal-100 text-teal-700 dark:text-teal-800 font-semibold text-base hover:bg-teal-50 dark:hover:bg-teal-200 transition-colors shadow-lg">
            {t.cta.button}
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="mt-6 flex items-center justify-center gap-2 text-teal-200 text-sm">
            <Users className="w-4 h-4" />
            <span>Join 2,000+ developers who already made theirs</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-stone-200 dark:border-stone-700">
        <div className="container-lg mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-teal-600" />
            <span className="font-semibold text-sm text-stone-500 dark:text-stone-400">PortGen</span>
          </div>
          <p className="text-stone-400 dark:text-stone-500 text-sm">
            {t.footer.copyright}
          </p>
        </div>
      </footer>

      {/* Auth Dialog */}
      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} onTryDemo={handleTryDemo} />

      {/* Demo Dialog */}
      <DemoDialog open={demoOpen} onClose={() => setDemoOpen(false)} onEnter={handleTryDemo} />
    </div>
  )
}

// ─── Demo Dialog ───────────────────────────────────────────────────────────────

import { Dialog, DialogBody } from '@/components/ui/Dialog'

function DemoDialog({ open, onClose, onEnter }: { open: boolean; onClose: () => void; onEnter: () => void }) {
  const { t } = useI18n()

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="text-center my-6 px-6">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-xl tracking-tight text-stone-900 dark:text-white">PortGen</span>
        </div>
        <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Try Demo Mode</h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">Explore with pre-created portfolios — no signup needed</p>
      </div>

      <DialogBody className="px-6 pb-6">
        <div className="space-y-3 mb-6">
          {[
            { icon: '🎨', text: '3 portfolios pre-created with demo data' },
            { icon: '🎭', text: 'All themes unlocked and editable' },
            { icon: '⚡', text: 'Full builder experience available' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm text-stone-700 dark:text-stone-200">{item.text}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-stone-400 dark:text-stone-500 mb-4 text-center">
          {t.login.noAccountNeeded}
        </p>

        <button
          onClick={onEnter}
          className="btn-primary w-full justify-center text-base py-3"
        >
          {t.login.enterDemo}
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 text-sm text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors py-2"
        >
          {t.common.cancel}
        </button>
      </DialogBody>
    </Dialog>
  )
}
