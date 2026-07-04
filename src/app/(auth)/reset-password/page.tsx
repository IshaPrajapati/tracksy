import { ResetPasswordForm } from '@/components/auth/reset-password-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Set New Password' }

export default function ResetPasswordPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Set new password</h2>
        <p className="text-muted-foreground mt-2">Choose a strong password for your account</p>
      </div>
      <ResetPasswordForm />
    </div>
  )
}
