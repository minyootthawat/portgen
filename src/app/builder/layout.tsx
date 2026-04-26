import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio Builder',
  description: 'Build and customize your developer portfolio with themes, projects, skills, and more.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
