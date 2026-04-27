'use client'

import { useState } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { User, Bell, Shield, CreditCard, Globe, Key, Save } from 'lucide-react'

interface FormFieldProps {
  label: string
  type?: string
  placeholder?: string
  defaultValue?: string
  description?: string
}

function FormField({ label, type = 'text', placeholder, defaultValue, description }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-stone-900 dark:text-white">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full px-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
      />
      {description && <p className="text-xs text-stone-500 dark:text-stone-400">{description}</p>}
    </div>
  )
}

function Toggle({ label, description, defaultChecked = false }: { label: string; description: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-stone-900 dark:text-white">{label}</p>
        <p className="text-sm text-stone-500 dark:text-stone-400">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-teal-600' : 'bg-stone-200 dark:bg-stone-700'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}

export default function SellerSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  const menuItems = [
    { id: 'profile', label: 'โปรไฟล์', icon: User },
    { id: 'notifications', label: 'การแจ้งเตือน', icon: Bell },
    { id: 'security', label: 'ความปลอดภัย', icon: Shield },
    { id: 'payment', label: 'วิธีการชำระเงิน', icon: CreditCard },
    { id: 'language', label: 'ภาษาและภูมิภาค', icon: Globe },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">การตั้งค่า</h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
          จัดการการตั้งค่าบัญชีและความชอบของคุณ
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Menu */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="card p-6">
                <SectionHeader title="ข้อมูลโปรไฟล์" subtitle="อัปเดตรายละเอียดส่วนตัวของคุณ" />
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <FormField label="ชื่อ-นามสกุล" placeholder="สมชาย ดีเจริญ" defaultValue="John Doe" />
                  <FormField label="อีเมล" type="email" placeholder="somchai@email.com" defaultValue="john@example.com" />
                  <FormField label="โทรศัพท์" type="tel" placeholder="+66 81 234 5678" defaultValue="+1 234 567 8900" />
                  <FormField label="ชื่อร้านค้า" placeholder="ร้านค้าของฉัน" defaultValue="John's Store" />
                </div>
                <div className="mt-6">
                  <FormField label="Bio" placeholder="บอกเล่าเกี่ยวกับตัวคุณ..." defaultValue="นักพัฒนา Full-stack มีประสบการณ์ 5 ปีในการสร้างเว็บแอปพลิเคชัน" />
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="btn-primary">
                    <Save className="w-4 h-4" />
                    บันทึก
                  </button>
                </div>
              </div>

              <div className="card p-6">
                <SectionHeader title="รูปโปรไฟล์" subtitle="รูปโปรไฟล์ของคุณ" />
                <div className="flex items-center gap-6 mt-4">
                  <div className="w-20 h-20 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-stone-500 dark:text-stone-400">JD</span>
                  </div>
                  <div>
                    <button className="btn-secondary mb-2">อัปโหลดรูปใหม่</button>
                    <p className="text-xs text-stone-500 dark:text-stone-400">JPG, PNG หรือ GIF. ขนาดสูงสุด 2MB</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-6">
              <SectionHeader title="การแจ้งเตือน" subtitle="จัดการวิธีที่คุณรับการแจ้งเตือน" />
              <div className="divide-y divide-stone-200 dark:divide-stone-700">
                <Toggle label="การแจ้งเตือนทางอีเมล" description="รับการอัปเดตคำสั่งซื้อทางอีเมล" defaultChecked={true} />
                <Toggle label="การแจ้งเตือนในเบราว์เซอร์" description="รับการแจ้งเตือนทันทีในเบราว์เซอร์ของคุณ" defaultChecked={true} />
                <Toggle label="อีเมลการตลาด" description="รับข้อเสนอโปรโมชันและการอัปเดต" defaultChecked={false} />
                <Toggle label="สรุปรายสัปดาห์" description="รับรายงานประจำสัปดาห์ของประสิทธิภาพร้านของคุณ" defaultChecked={true} />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="card p-6">
                <SectionHeader title="ความปลอดภัย" subtitle="รักษาบัญชีของคุณให้ปลอดภัย" />
                <div className="space-y-4 mt-6">
                  <FormField label="รหัสผ่านปัจจุบัน" type="password" placeholder="ใส่รหัสผ่านปัจจุบัน" />
                  <FormField label="รหัสผ่านใหม่" type="password" placeholder="ใส่รหัสผ่านใหม่" />
                  <FormField label="ยืนยันรหัสผ่านใหม่" type="password" placeholder="ยืนยันรหัสผ่านใหม่" />
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="btn-primary">
                    <Key className="w-4 h-4" />
                    อัปเดตรหัสผ่าน
                  </button>
                </div>
              </div>

              <div className="card p-6">
                <SectionHeader title="การยืนยันสองขั้นตอน" subtitle="เพิ่มชั้นความปลอดภัยพิเศษให้บัญชีของคุณ" />
                <div className="flex items-center justify-between py-4 mt-4">
                  <div>
                    <p className="font-medium text-stone-900 dark:text-white">แอปตรวจสอบสิทธิ์</p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">ใช้แอปตรวจสอบสิทธิ์เพื่อรับรหัสยืนยัน</p>
                  </div>
                  <button className="btn-secondary">เปิดใช้งาน</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="card p-6">
              <SectionHeader title="วิธีการชำระเงิน" subtitle="จัดการวิธีการรับเงินของคุณ" />
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-stone-200 dark:border-stone-700">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-900 dark:text-white">Visa ending in 4242</p>
                      <p className="text-sm text-stone-500 dark:text-stone-400">หมดอายุ 12/2025</p>
                    </div>
                  </div>
                  <span className="badge badge-success">ค่าเริ่มต้น</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-stone-200 dark:border-stone-700">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-900 dark:text-white">Mastercard ending in 8888</p>
                      <p className="text-sm text-stone-500 dark:text-stone-400">หมดอายุ 03/2026</p>
                    </div>
                  </div>
                  <button className="text-sm text-teal-600 dark:text-teal-400 hover:underline">ตั้งเป็นค่าเริ่มต้น</button>
                </div>
              </div>
              <button className="btn-secondary mt-6">
                <CreditCard className="w-4 h-4" />
                เพิ่มวิธีการชำระเงิน
              </button>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="card p-6">
              <SectionHeader title="ภาษาและภูมิภาค" subtitle="ปรับแต่งประสบการณ์ของคุณ" />
              <div className="space-y-6 mt-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-stone-900 dark:text-white">ภาษา</label>
                  <select className="w-full px-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>English</option>
                    <option>ไทย</option>
                    <option>Chinese (Simplified)</option>
                    <option>Japanese</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-stone-900 dark:text-white">เวลา</label>
                  <select className="w-full px-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>UTC+0 (London)</option>
                    <option>UTC+7 (Bangkok)</option>
                    <option>UTC+8 (Singapore)</option>
                    <option>UTC+9 (Tokyo)</option>
                    <option>UTC-5 (New York)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-stone-900 dark:text-white">สกุลเงิน</label>
                  <select className="w-full px-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>THB (฿)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="btn-primary">
                  <Save className="w-4 h-4" />
                  บันทึก
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
