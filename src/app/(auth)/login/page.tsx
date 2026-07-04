import { LoginForm } from '@/components/auth/login-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sign In' }

export default function LoginPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Welcome back</h2>
        <p className="text-muted-foreground mt-2">Sign in to your Tracksy account</p>
      </div>
      <LoginForm />
    </div>
  )
}
