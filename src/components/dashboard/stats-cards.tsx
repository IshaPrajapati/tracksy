'use client'

import { FolderKanban, CheckSquare, Clock, AlertTriangle, TrendingUp, Target } from 'lucide-react'
import type { DashboardStats } from '@/types'

interface StatsCardsProps {
  stats: DashboardStats | null
}



export function StatsCards({ stats }: StatsCardsProps) {
  if (!stats) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-[20px] bg-card border border-border p-5 animate-pulse h-28" />
      ))}
    </div>
  )

  const completionRate = stats.completionRate ?? 0

  const items = [
    {
      label: 'Active Projects',
      value: stats.totalProjects ?? 0,
      icon: FolderKanban,
    },
    {
      label: 'Tasks Completed',
      value: stats.completedTasks ?? 0,
      icon: CheckSquare,
    },
    {
      label: 'Pending Tasks',
      value: stats.pendingTasks ?? 0,
      icon: Clock,
    },
    {
      label: 'Overdue Tasks',
      value: stats.overdueTasks ?? 0,
      icon: Target,
    },
    {
      label: 'Productivity Score',
      value: completionRate,
      suffix: '%',
      icon: TrendingUp,
    },
    {
      label: 'Workspace Health',
      value: completionRate > 70 ? 'Good' : completionRate > 40 ? 'Fair' : 'Needs Attention',
      icon: AlertTriangle,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[20px] bg-card border border-border p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-300 shadow-sm hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <item.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-[28px] font-bold text-foreground leading-none">
              {item.value}{item.suffix ?? ''}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
