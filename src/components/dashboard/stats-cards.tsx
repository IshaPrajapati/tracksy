'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { FolderKanban, CheckSquare, Clock, AlertTriangle, TrendingUp, Target } from 'lucide-react'
import type { DashboardStats } from '@/types'
import { cn } from '@/lib/utils'

interface StatsCardsProps {
  stats: DashboardStats | null
}

const items = (stats: DashboardStats) => [
  {
    label: 'Total Projects',
    value: stats.totalProjects,
    icon: FolderKanban,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
  },
  {
    label: 'Total Tasks',
    value: stats.totalTasks,
    icon: Target,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    label: 'Completed',
    value: stats.completedTasks,
    icon: CheckSquare,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    extra: (
      <div className="mt-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Completion Rate</span>
          <span>{stats.completionRate}%</span>
        </div>
        <Progress value={stats.completionRate} className="h-1.5" />
      </div>
    ),
  },
  {
    label: 'Pending',
    value: stats.pendingTasks,
    icon: Clock,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    label: 'Overdue',
    value: stats.overdueTasks,
    icon: AlertTriangle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  {
    label: 'Completion Rate',
    value: `${stats.completionRate}%`,
    icon: TrendingUp,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
  },
]

export function StatsCards({ stats }: StatsCardsProps) {
  if (!stats) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {items(stats).map((item) => (
        <Card key={item.label} className={cn('border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5', item.border)}>
          <CardContent className="p-4">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', item.bg)}>
              <item.icon className={cn('w-5 h-5', item.color)} />
            </div>
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
            {item.extra}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
