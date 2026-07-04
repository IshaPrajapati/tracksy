'use client'

import { formatRelative } from '@/lib/utils'
import { MoreHorizontal } from 'lucide-react'
import type { ActivityLog } from '@/types'

interface RecentActivityProps {
  activities: ActivityLog[]
}

const ACTION_LABELS: Record<string, string> = {
  created_project: 'created a new project',
  updated_project: 'updated project settings',
  created_task: 'created task',
  updated_task: 'updated task',
  moved_task: 'moved task',
  commented: 'commented on',
  deleted_task: 'deleted task',
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="rounded-[20px] bg-card border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[15px] font-semibold text-foreground">Recent Activity</h3>
        <button className="w-8 h-8 flex items-center justify-center rounded-[10px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
        {activities.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No recent activity
          </div>
        ) : (
          <div className="relative before:absolute before:inset-y-2 before:left-2 before:w-px before:bg-border space-y-4">
            {activities.map((activity) => {
              const label = ACTION_LABELS[activity.action] || activity.action
              const detail = (activity.details as any)?.task_title || (activity.details as any)?.project_name
              return (
                <div key={activity.id} className="flex items-start gap-4 relative">
                  {/* Dot */}
                  <div className="w-4 h-4 rounded-full border-2 border-card bg-muted-foreground/30 relative z-10 mt-1" />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-secondary-foreground leading-snug">
                      <span className="font-medium text-foreground">{activity.user?.full_name ?? 'Someone'}</span>{' '}
                      {label}
                      {detail && <span className="font-medium text-foreground"> "{detail}"</span>}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatRelative(activity.created_at)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
