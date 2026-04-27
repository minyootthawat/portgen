'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { AuthDialog } from '@/components/AuthDialog'
import { Check, ArrowRight, Sparkles, Play, Star, Users, LogOut } from 'lucide-react'

export default function LandingPage() {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'
  const [authOpen, setAuthOpen] = useState(false)
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


  return (
    <div className="min-h-screen bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100" ref={sectionsRef}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700">
        <div className="container-lg mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
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
              ฟีเจอร์
            </a>
            <a href="#pricing" className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
              ราคา
            </a>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isLoading ? (
              <div className="w-20 h-8 bg-stone-200 dark:bg-stone-700 rounded-lg animate-pulse" />
            ) : session ? (
              <>
                <span className="text-sm text-stone-600 dark:text-stone-400">
                  {session.user?.name || session.user?.email}
                </span>
                <Link href="/dashboard" className="btn-ghost text-sm dark:text-stone-300">
                  Dashboard
                </Link>
                <button onClick={() => signOut()} className="btn-ghost text-sm dark:text-stone-300">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button onClick={() => setAuthOpen(true)} className="btn-primary text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-sm">
                เริ่มใช้ฟรี
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div id="mobile-menu" className="hidden md:hidden border-t border-stone-200 dark:border-stone-700 px-6 py-4 space-y-3">
          <a href="#features" className="block text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"> ฟีเจอร์</a>
          <a href="#pricing" className="block text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"> ราคา</a>
          <div className="flex items-center gap-3 pt-2">
            <ThemeToggle />
          </div>
          <button onClick={() => setAuthOpen(true)} className="btn-primary text-sm bg-teal-600 hover:bg-teal-700 text-white w-full justify-center">เริ่มใช้ฟรี</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="section bg-gradient-to-b from-white dark:from-stone-900 to-teal-50 dark:to-teal-950 relative overflow-hidden">
        <div className="container mx-auto text-center max-w-3xl relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-sm text-teal-700 dark:text-teal-300 mb-8 border border-teal-200 dark:border-teal-800 animate-fade-in-up">
            <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>🚀 ฟรีเริ่มต้น — ไม่ต้องใช้บัตรเครดิต</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 dark:text-white mb-6 leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            พอร์ตโฟลิโอสวย ๆ ใน 5 นาที
            <br />
            <span className="text-teal-600 dark:text-teal-400">— ไม่ต้องรู้เรื่องโค้ดเลยสักบรรทัด</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-stone-500 dark:text-stone-400 max-w-xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            สร้างพอร์ตโฟลิโอที่ดูโปรได้ด้วยตัวเอง ไม่ต้องจ้างใคร ไม่ต้องเรียนเทคนิค กด 2-3 ครั้ง ออนไลน์ได้ทันที
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            {isLoading ? (
              <div className="w-48 h-12 bg-stone-200 dark:bg-stone-700 rounded-xl animate-pulse" />
            ) : session ? (
              <Link href="/dashboard" className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/30">
                ไปยัง Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button onClick={() => setAuthOpen(true)} className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/30">
                สร้างพอร์ตฟรี — ไม่ต้องใส่บัตรเครดิต
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <Link href="/p/demo" className="btn-secondary text-base px-8 py-3.5">
              <Play className="w-4 h-4" />
              ลองดูตัวอย่าง
            </Link>
          </div>

          {/* Mini portfolio preview */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
            <p className="text-xs text-stone-400 dark:text-stone-500 mb-3 uppercase tracking-widest">Portfolio ของคุณจะเป็นแบบนี้ →</p>
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
              <div className="bg-gradient-to-br from-teal-900 to-stone-900 p-6">
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
            <p className="text-sm text-stone-400 dark:text-stone-500">สำหรับนักพัฒนาที่ต้องการให้ผลงานโดดเด่น</p>
          </div>
        </div>
      </section>

      {/* Watch Demo Section */}
      <section className="section-sm bg-stone-50 dark:bg-stone-800/50 reveal">
        <div className="container-lg mx-auto">
          <div className="text-center reveal">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">ดูวิธีใช้งาน</h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm mb-8">ดูว่าการสร้าง portfolio ใช้เวลาไม่ถึง 5 นาทีได้อย่างไร</p>
          </div>
          <div className="max-w-3xl mx-auto">
            {/* Video placeholder */}
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-xl aspect-video bg-stone-200 dark:bg-stone-800 group cursor-pointer">
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
                <p className="text-white/90 text-sm font-medium">ลอง Demo — ไม่ต้องสมัครสมาชิก</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section bg-white dark:bg-stone-900">
        <div className="container-lg mx-auto">
          <div className="text-center mb-14 reveal">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white mb-3">ทำไมต้อง PortGen?</h2>
            <p className="text-stone-500 dark:text-stone-400 text-base max-w-lg mx-auto">
              ทุกอย่างที่ต้องการเพื่อดูโปร — ไม่ต้องยุ่งยาก
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 reveal-stagger">
            {[
              {
                title: 'เทมเพลตสวย ดูแพง ไม่ต้องจ้างใคร',
                desc: 'เลือกจากเทมเพลตสวย ๆ ที่ออกแบบมาแล้ว พอร์ตโฟลิโอคุณจะดูเหมือนจ้างมาด้วยราคาแพง',
              },
              {
                title: 'ออนไลน์ได้ทันทีที่พร้อม',
                desc: 'ไม่ต้องรอ ไม่ต้องรับอนุมัติ พอร์ตโฟลิโอของคุณออนไลน์ทันทีที่กดเผยแพร่',
              },
              {
                title: 'ใช้เวลาสร้างไม่ถึง 5 นาที',
                desc: 'กรอกข้อมูล เลือกเทมเพลต กดเผยแพร่ เสร็จ เร็วจริง ๆ',
              },
              {
                title: 'แก้ไขได้เรื่อย ๆ ตามใจ',
                desc: 'เพิ่มโปรเจกต์ใหม่ เปลี่ยนรูป แก้ไขประวัติ — อยากแก้เมื่อไหร่ก็ได้',
              },
              {
                title: 'ถ้าใช้ Facebook ได้ = ใช้ได้',
                desc: 'ไม่ต้องรู้โค้ด ไม่ต้องจำเมนูเยอะ ชี้ คลิก พิมพ์ เรียบร้อย',
              },
              {
                title: 'แชร์ลิงก์เดียวจบ ไม่ต้องส่ง PDF',
                desc: 'ลิงก์พอร์ตโฟลิโออันเดียว ส่งในอีเมล ข้อความ หรือใบสมัครงานก็ได้',
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
              เรื่องราวจริงจากผู้ใช้จริง
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto reveal-stagger">
            {[
              { quote: 'ตอนแรกกลัวว่าจะยาก สรุปทำเสร็จใน 10 นาที', author: 'สมศักดิ์ ที., ผู้สมัครงาน' },
              { quote: 'หางานมาเป็นปีไม่มีใครเรียก พอทำพอร์ตเสร็จ สัปดาห์ต่อมาโดนเรียก 3 ที่', author: 'นิรันดร์ ค., นักออกแบบกราฟิก' },
              { quote: 'ไม่ต้องส่ง PDF ทุกครั้ง แชร์ลิงก์เดียวจบ', author: 'ปรียา เอส., ผู้จัดการฝ่ายการตลาด' },
            ].map((item, i) => (
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
              { value: '100%', label: 'ฟรีเริ่มต้น' },
              { value: '< 5 นาที', label: 'ใช้เวลาสร้างโดยเฉลี่ย' },
              { value: '3', label: 'ธีมสวยๆ' },
              { value: 'Export', label: 'HTML ได้ทุกเมื่อ' },
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
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white mb-3">ราคาที่เข้าใจได้</h2>
            <p className="text-stone-500 dark:text-stone-400 text-base max-w-lg mx-auto">
              เริ่มฟรี อัพเกรดเมื่อพร้อม
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto reveal-stagger">
            {/* Free */}
            <div className="card card-hover p-8">
              <div className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-1">ฟรี</div>
              <div className="text-4xl font-bold tracking-tight text-stone-900 dark:text-white mb-1">
                $0<span className="text-lg font-normal text-stone-400 dark:text-stone-500">/เดือน</span>
              </div>
              <div className="text-stone-400 dark:text-stone-500 text-sm mb-7">เริ่มใช้ฟรี</div>

              <ul className="space-y-3 mb-8">
                {[
                  '1 พอร์ตโฟลิโอ',
                  '3 ธีมสวยๆ',
                  'subdomain บน portgen.com',
                  'ปรับแต่งพื้นฐาน',
                  'Export HTML',
                  'ช่วยเหลือจากชุมชน',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-stone-600 dark:text-stone-300">
                    <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button onClick={() => setAuthOpen(true)} className="btn-secondary w-full justify-center">
                เริ่มฟรี
              </button>
            </div>

            {/* Pro */}
            <div className="card card-hover p-8 border-teal-200 dark:border-teal-800 relative shadow-lg shadow-teal-600/10">
              <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-xs font-semibold text-white shadow-sm">
                ได้รับความนิยมสูงสุด
              </div>

              <div className="text-sm font-semibold text-teal-700 dark:text-teal-300 mb-1">Pro</div>
              <div className="text-4xl font-bold tracking-tight text-stone-900 dark:text-white mb-1">
                $5<span className="text-lg font-normal text-stone-400 dark:text-stone-500">/เดือน</span>
              </div>
              <p className="text-teal-700 dark:text-teal-300 text-sm mb-3">เหมาะสำหรับคนที่เขาจริงจังกับอาชีพ</p>
              <div className="text-stone-400 dark:text-stone-500 text-sm mb-7">เก็บเงินรายเดือน</div>

              <ul className="space-y-3 mb-8">
                {[
                  'พอร์ตโฟลิโอไม่จำกัด',
                  '15+ ธีมสวยๆ',
                  'รองรับ Custom Domain',
                  'ลบแบรนด์ PortGen',
                  'แดชบอร์ดวิเคราะห์',
                  'สนับสนุนลำดับความสำคัญสูง',
                  'เข้าถึงธีมใหม่ก่อน',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-stone-600 dark:text-stone-300">
                    <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button onClick={() => setAuthOpen(true)} className="btn-primary w-full justify-center shadow-md">
                ทดลองใช้ Pro ฟรี
              </button>
              <p className="text-center text-xs text-stone-400 dark:text-stone-500 mt-3">
                ทดลองฟรี 7 วัน • ยกเลิกได้ทุกเมื่อ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-to-br from-teal-600 dark:from-teal-700 to-teal-700 dark:to-teal-800 text-white dark:text-teal-50 reveal">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight mb-4">พร้อมแล้วใช่มั้ย? มาสร้างพอร์ตแรกของคุณกัน</h2>
          <p className="text-teal-100 dark:text-teal-200 text-base mb-9">
            ร่วมกับนักพัฒนาที่เลิกส่ง PDF resume แล้ว
          </p>
          <button onClick={() => setAuthOpen(true)} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-white dark:bg-teal-100 text-teal-700 dark:text-teal-800 font-semibold text-base hover:bg-teal-50 dark:hover:bg-teal-200 transition-colors shadow-lg">
            สร้างพอร์ตฟรี →
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="mt-6 flex items-center justify-center gap-2 text-teal-200 text-sm">
            <Users className="w-4 h-4" />
            <span>สำหรับนักพัฒนาที่ต้องการให้ผลงานโดดเด่น</span>
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
            © 2026 PortGen. สร้างด้วย ❤️ สำหรับนักพัฒนาทุกคน
          </p>
        </div>
      </footer>

      {/* Auth Dialog */}
      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}
