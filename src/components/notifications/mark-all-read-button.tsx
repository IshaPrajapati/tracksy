'use client'

import { Button } from '@/components/ui/button'
import { markAllNotificationsRead } from '@/actions/user'
import { useState } from 'react'
import { toast } from 'sonner'

export function MarkAllReadButton() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleClick() {
    setIsLoading(true)
    await markAllNotificationsRead()
    toast.success('All notifications marked as read')
    setIsLoading(false)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick} loading={isLoading}>
      Mark all read
    </Button>
  )
}
