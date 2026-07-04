'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { changePasswordSchema, type ChangePasswordInput } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [show, setShow] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  })

  async function onSubmit(data: ChangePasswordInput) {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: data.new_password })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password updated!')
      reset()
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="new-pw" className="text-sm font-medium">New Password</label>
        <div className="relative">
          <Input id="new-pw" type={show ? 'text' : 'password'} placeholder="Min. 8 characters" className="pr-10" {...register('new_password')} />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.new_password && <p className="text-xs text-destructive">{errors.new_password.message}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="confirm-pw" className="text-sm font-medium">Confirm Password</label>
        <Input id="confirm-pw" type={show ? 'text' : 'password'} placeholder="Confirm new password" {...register('confirm_password')} />
        {errors.confirm_password && <p className="text-xs text-destructive">{errors.confirm_password.message}</p>}
      </div>
      <Button type="submit" loading={isLoading}>Update Password</Button>
    </form>
  )
}
