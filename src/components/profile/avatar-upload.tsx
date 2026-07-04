'use client'

import { useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/lib/utils'
import { uploadAvatar } from '@/actions/user'
import { Camera } from 'lucide-react'
import { toast } from 'sonner'
import type { Profile } from '@/types'

export function AvatarUpload({ profile }: { profile: Profile | null }) {
  const [avatar, setAvatar] = useState(profile?.avatar_url ?? '')
  const [isUploading, setIsUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('File must be under 5MB'); return }

    // Preview
    const reader = new FileReader()
    reader.onload = (ev) => setAvatar(ev.target?.result as string)
    reader.readAsDataURL(file)

    setIsUploading(true)
    const formData = new FormData()
    formData.append('avatar', file)
    const result = await uploadAvatar(formData)
    if (result.error) {
      toast.error(result.error)
      setAvatar(profile?.avatar_url ?? '')
    } else {
      toast.success('Avatar updated!')
    }
    setIsUploading(false)
  }

  return (
    <div className="flex items-center gap-6">
      <div className="relative group">
        <Avatar className="w-20 h-20">
          <AvatarImage src={avatar} alt={profile?.full_name ?? ''} />
          <AvatarFallback className="text-xl">{getInitials(profile?.full_name)}</AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          onClick={() => fileRef.current?.click()}>
          <Camera className="w-5 h-5 text-white" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium">{profile?.full_name ?? 'Your Name'}</p>
        <p className="text-xs text-muted-foreground mb-3">{profile?.email}</p>
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} loading={isUploading}>
          <Camera className="w-4 h-4 mr-2" />Change Photo
        </Button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  )
}
