'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileInput } from '@/lib/validations'
import { updateProfile } from '@/actions/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import type { Profile } from '@/types'

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name ?? '',
      bio: profile?.bio ?? '',
    },
  })

  async function onSubmit(data: ProfileInput) {
    setIsLoading(true)
    const result = await updateProfile(data)
    if (result.error) toast.error(result.error)
    else toast.success('Profile updated!')
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="profile-name" className="text-sm font-medium">Full Name</label>
        <Input id="profile-name" {...register('full_name')} />
        {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="profile-email" className="text-sm font-medium">Email</label>
        <Input id="profile-email" value={profile?.email ?? ''} disabled className="opacity-60" />
        <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="profile-bio" className="text-sm font-medium">Bio</label>
        <Textarea id="profile-bio" placeholder="Tell us about yourself..." rows={3} {...register('bio')} />
        {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
      </div>
      <Button type="submit" loading={isLoading}>Save Changes</Button>
    </form>
  )
}
