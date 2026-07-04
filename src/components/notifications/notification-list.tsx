'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatRelative } from '@/lib/utils'
import { markNotificationRead } from '@/actions/user'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials, cn } from '@/lib/utils'
import { Bell, CheckSquare, MessageSquare, FolderKanban, AtSign, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Notification } from '@/types'

const ICON_MAP = {
  task_assigned: CheckSquare,
  task_updated: CheckSquare,
  comment_added: MessageSquare,
  project_invite: FolderKanban,
  mention: AtSign,
  task_due_soon: AlertTriangle,
}

interface NotificationListProps {
  initialNotifications: Notification[]
}

export function NotificationList({ initialNotifications }: NotificationListProps) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const router = useRouter()

  async function handleRead(n: Notification) {
    if (!n.is_read) {
      await markNotificationRead(n.id)
      setNotifications((prev) => prev.map((item) => item.id === n.id ? { ...item, is_read: true } : item))
    }

    if (n.resource_type === 'task' && n.resource_id) {
      const supabase = createClient()
      const { data } = await supabase.from('tasks').select('project_id').eq('id', n.resource_id).single()
      if (data?.project_id) {
        router.push(`/projects/${data.project_id}/board?taskId=${n.resource_id}`)
      }
    } else if (n.resource_type === 'project' && n.resource_id) {
      router.push(`/projects/${n.resource_id}/board`)
    }
  }

  if (!notifications.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Bell className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground">You&apos;re all caught up!</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {notifications.map((n) => {
        const Icon = ICON_MAP[n.type] ?? Bell
        return (
          <div
            key={n.id}
            onClick={() => handleRead(n)}
            className={cn(
              'flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:border-primary/30',
              n.is_read ? 'border-border opacity-60' : 'border-primary/20 bg-primary/5'
            )}
          >
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', n.is_read ? 'bg-muted' : 'bg-primary/10')}>
              <Icon className={cn('w-4 h-4', n.is_read ? 'text-muted-foreground' : 'text-primary')} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{n.title}</p>
              {n.body && <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>}
              <p className="text-xs text-muted-foreground mt-1">{formatRelative(n.created_at)}</p>
            </div>
            {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
          </div>
        )
      })}
    </div>
  )
}
