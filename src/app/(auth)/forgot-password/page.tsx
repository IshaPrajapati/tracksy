import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Forgot Password' }

export default function ForgotPasswordPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Reset password</h2>
        <p className="text-muted-foreground mt-2">Enter your email to receive a reset link</p>
      </div>
      <ForgotPasswordForm />
    </div>
  )
}
