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

const menuItems = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'payment', label: 'Payment Methods', icon: CreditCard },
  { id: 'language', label: 'Language & Region', icon: Globe },
]

export default function SellerSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Settings</h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
          Manage your account settings and preferences
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
                <SectionHeader title="Profile Information" subtitle="Update your personal details" />
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <FormField label="Full Name" placeholder="John Doe" defaultValue="John Doe" />
                  <FormField label="Email" type="email" placeholder="john@example.com" defaultValue="john@example.com" />
                  <FormField label="Phone" type="tel" placeholder="+1 234 567 8900" defaultValue="+1 234 567 8900" />
                  <FormField label="Store Name" placeholder="My Store" defaultValue="John's Store" />
                </div>
                <div className="mt-6">
                  <FormField label="Bio" placeholder="Tell us about yourself..." defaultValue="Full-stack developer with 5 years of experience building web applications." />
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="btn-primary">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="card p-6">
                <SectionHeader title="Avatar" subtitle="Your profile picture" />
                <div className="flex items-center gap-6 mt-4">
                  <div className="w-20 h-20 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-stone-500 dark:text-stone-400">JD</span>
                  </div>
                  <div>
                    <button className="btn-secondary mb-2">Upload New Image</button>
                    <p className="text-xs text-stone-500 dark:text-stone-400">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-6">
              <SectionHeader title="Notification Preferences" subtitle="Control how you receive notifications" />
              <div className="divide-y divide-stone-200 dark:divide-stone-700">
                <Toggle label="Email Notifications" description="Receive order updates via email" defaultChecked={true} />
                <Toggle label="Browser Notifications" description="Get instant alerts in your browser" defaultChecked={true} />
                <Toggle label="Marketing Emails" description="Receive promotional offers and updates" defaultChecked={false} />
                <Toggle label="Weekly Summary" description="Get a weekly report of your store performance" defaultChecked={true} />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="card p-6">
                <SectionHeader title="Change Password" subtitle="Update your password to keep your account secure" />
                <div className="space-y-4 mt-6">
                  <FormField label="Current Password" type="password" placeholder="Enter current password" />
                  <FormField label="New Password" type="password" placeholder="Enter new password" />
                  <FormField label="Confirm New Password" type="password" placeholder="Confirm new password" />
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="btn-primary">
                    <Key className="w-4 h-4" />
                    Update Password
                  </button>
                </div>
              </div>

              <div className="card p-6">
                <SectionHeader title="Two-Factor Authentication" subtitle="Add an extra layer of security to your account" />
                <div className="flex items-center justify-between py-4 mt-4">
                  <div>
                    <p className="font-medium text-stone-900 dark:text-white">Authenticator App</p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">Use an authenticator app to get verification codes</p>
                  </div>
                  <button className="btn-secondary">Enable</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="card p-6">
              <SectionHeader title="Payment Methods" subtitle="Manage your payout methods" />
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-stone-200 dark:border-stone-700">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-900 dark:text-white">Visa ending in 4242</p>
                      <p className="text-sm text-stone-500 dark:text-stone-400">Expires 12/2025</p>
                    </div>
                  </div>
                  <span className="badge badge-success">Default</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-stone-200 dark:border-stone-700">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-900 dark:text-white">Mastercard ending in 8888</p>
                      <p className="text-sm text-stone-500 dark:text-stone-400">Expires 03/2026</p>
                    </div>
                  </div>
                  <button className="text-sm text-teal-600 dark:text-teal-400 hover:underline">Set as default</button>
                </div>
              </div>
              <button className="btn-secondary mt-6">
                <CreditCard className="w-4 h-4" />
                Add Payment Method
              </button>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="card p-6">
              <SectionHeader title="Language & Region" subtitle="Customize your experience" />
              <div className="space-y-6 mt-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-stone-900 dark:text-white">Language</label>
                  <select className="w-full px-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>English</option>
                    <option>Thai</option>
                    <option>Chinese (Simplified)</option>
                    <option>Japanese</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-stone-900 dark:text-white">Timezone</label>
                  <select className="w-full px-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>UTC+0 (London)</option>
                    <option>UTC+7 (Bangkok)</option>
                    <option>UTC+8 (Singapore)</option>
                    <option>UTC+9 (Tokyo)</option>
                    <option>UTC-5 (New York)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-stone-900 dark:text-white">Currency</label>
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
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}