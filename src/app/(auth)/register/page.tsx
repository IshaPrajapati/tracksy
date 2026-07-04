import { RegisterForm } from '@/components/auth/register-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Create Account' }

export default function RegisterPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Create account</h2>
        <p className="text-muted-foreground mt-2">Join Tracksy and start managing projects</p>
      </div>
      <RegisterForm />
    </div>
  )
}
