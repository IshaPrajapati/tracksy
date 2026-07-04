'use client'

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { PRIORITY_CONFIG, STATUS_CONFIG } from '@/lib/utils'
import { TrendingUp, CheckSquare, AlertTriangle, Clock } from 'lucide-react'
import type { Task, TaskStatus, Priority } from '@/types'

interface AnalyticsDashboardProps {
  tasks: Task[]
  projectId: string
}

const STATUS_COLORS: Record<TaskStatus, string> = {
  backlog: '#64748b',
  todo: '#3b82f6',
  in_progress: '#8b5cf6',
  review: '#f59e0b',
  completed: '#10b981',
}

const PRIORITY_COLORS: Record<Priority, string> = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#f97316',
  urgent: '#ef4444',
}

export function AnalyticsDashboard({ tasks }: AnalyticsDashboardProps) {
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === 'completed').length
    const overdue = tasks.filter((t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed').length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    const byStatus = Object.entries(
      tasks.reduce((acc, t) => { acc[t.status] = (acc[t.status] ?? 0) + 1; return acc }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name: STATUS_CONFIG[name as TaskStatus]?.label ?? name, value, color: STATUS_COLORS[name as TaskStatus] ?? '#888' }))

    const byPriority = Object.entries(
      tasks.reduce((acc, t) => { acc[t.priority] = (acc[t.priority] ?? 0) + 1; return acc }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name: PRIORITY_CONFIG[name as Priority]?.label ?? name, value, color: PRIORITY_COLORS[name as Priority] ?? '#888' }))

    // Tasks per assignee
    const byAssignee = Object.entries(
      tasks.reduce((acc, t) => {
        const name = t.assignee?.full_name ?? 'Unassigned'
        acc[name] = (acc[name] ?? 0) + 1
        return acc
      }, {} as Record<string, number>)
    ).map(([name, tasks]) => ({ name, tasks }))

    return { total, completed, overdue, completionRate, byStatus, byPriority, byAssignee }
  }, [tasks])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: stats.total, icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Completed', value: stats.completed, icon: CheckSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-500/10' },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${item.bg}`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              {item.label === 'Completion Rate' && (
                <Progress value={stats.completionRate} className="mt-2 h-1.5" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Status */}
        <Card>
          <CardHeader><CardTitle className="text-base">Tasks by Status</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={stats.byStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {stats.byStatus.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'hsl(222 47% 8%)', border: '1px solid hsl(217.2 32.6% 14%)', borderRadius: '12px' }}
                  labelStyle={{ color: 'hsl(210 40% 98%)' }}
                />
                <Legend formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* By Priority */}
        <Card>
          <CardHeader><CardTitle className="text-base">Tasks by Priority</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.byPriority} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217.2 32.6% 14%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(215 20.2% 55%)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(215 20.2% 55%)' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'hsl(222 47% 8%)', border: '1px solid hsl(217.2 32.6% 14%)', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {stats.byPriority.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* By Assignee */}
      {stats.byAssignee.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Team Productivity</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.byAssignee} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217.2 32.6% 14%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(215 20.2% 55%)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(215 20.2% 55%)' }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'hsl(222 47% 8%)', border: '1px solid hsl(217.2 32.6% 14%)', borderRadius: '12px' }} />
                <Bar dataKey="tasks" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
