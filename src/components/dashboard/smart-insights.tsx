'use client'

import { CheckCircle2, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react'
import type { DashboardStats } from '@/types'

interface SmartInsightsProps {
  stats: DashboardStats | null
}

export function SmartInsights({ stats }: SmartInsightsProps) {
  if (!stats) return null

  const completionRate = stats.completionRate ?? 0
  const overdue = stats.overdueTasks ?? 0
  const completed = stats.completedTasks ?? 0
  const totalProjects = stats.totalProjects ?? 0

  const insights = [
    {
      icon: CheckCircle2,
      text: completed > 0
        ? `You completed ${completed} task${completed !== 1 ? 's' : ''} this week.`
        : 'Complete your first task to start building momentum.',
    },
    {
      icon: TrendingUp,
      text: completionRate > 0
        ? `Project completion improved by ${Math.min(completionRate, 8)}%.`
        : `Your completion rate is ${completionRate}%. Let's work on closing open tasks.`,
    },
    {
      icon: AlertTriangle,
      text: overdue > 0
        ? `${overdue} deadline${overdue !== 1 ? 's' : ''} approaching tomorrow.`
        : 'Everything looks healthy today.',
    },
    {
      icon: Lightbulb,
      text: totalProjects > 0
        ? `You have ${totalProjects} active project${totalProjects !== 1 ? 's' : ''} in progress.`
        : 'Create your first project to unlock Tracksy.',
    },
  ]

  return (
    <div className="rounded-[20px] bg-card border border-border p-6 shadow-sm">
      <h3 className="text-[15px] font-semibold text-foreground mb-4">Workspace Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, i) => {
          const Icon = insight.icon
          return (
            <div key={i} className="flex items-start gap-3">
              <Icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm text-secondary-foreground">{insight.text}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
