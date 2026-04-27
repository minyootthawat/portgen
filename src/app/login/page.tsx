'use client'

import { Suspense } from 'react'
import { AuthDialog } from '@/components/AuthDialog'

function LoginContent() {
  return <AuthDialog open={true} onClose={() => {}} />
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  )
}
