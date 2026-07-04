'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatRelative, getInitials } from '@/lib/utils'
import { Activity } from 'lucide-react'
import type { ActivityLog } from '@/types'

interface RecentActivityProps {
  activities: ActivityLog[]
}

const actionLabels: Record<string, string> = {
  created_project: 'created project',
  updated_project: 'updated project',
  created_task: 'created task',
  updated_task: 'updated task',
  moved_task: 'moved task',
  commented: 'commented on a task',
  deleted_task: 'deleted task',
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (!activities.length) {
    return (
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Activity className="w-4 h-4" />Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Activity className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Activity className="w-4 h-4" />Recent Activity</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <Avatar className="w-7 h-7 flex-shrink-0 mt-0.5">
                <AvatarImage src={activity.user?.avatar_url ?? ''} />
                <AvatarFallback className="text-[10px]">{getInitials(activity.user?.full_name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.user?.full_name ?? 'Someone'}</span>{' '}
                  <span className="text-muted-foreground">{actionLabels[activity.action] ?? activity.action}</span>
                  {(activity.details as any)?.task_title && (
                    <span className="font-medium"> &quot;{(activity.details as any).task_title}&quot;</span>
                  )}
                  {(activity.details as any)?.project_name && (
                    <span className="font-medium"> &quot;{(activity.details as any).project_name}&quot;</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{formatRelative(activity.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
