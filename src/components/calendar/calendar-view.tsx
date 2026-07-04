'use client'

import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn, PRIORITY_CONFIG, isOverdue } from '@/lib/utils'
import { TaskDetailDialog } from '../tasks/task-detail-dialog'
import type { Task } from '@/types'

interface CalendarViewProps {
  tasks: Task[]
  projectId: string
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const tasksByDate = tasks.reduce((acc, task) => {
    if (!task.due_date) return acc
    const d = format(new Date(task.due_date), 'yyyy-MM-dd')
    if (!acc[d]) acc[d] = []
    acc[d].push(task)
    return acc
  }, {} as Record<string, Task[]>)

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>Today</Button>
          <Button variant="outline" size="icon-sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="rounded-2xl border border-border overflow-hidden bg-card">
        {/* Day names */}
        <div className="grid grid-cols-7 border-b border-border">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day) => {
            const key = format(day, 'yyyy-MM-dd')
            const dayTasks = tasksByDate[key] ?? []
            const isToday = isSameDay(day, new Date())
            const isCurrentMonth = isSameMonth(day, currentMonth)

            return (
              <div
                key={key}
                className={cn(
                  'min-h-[100px] p-1.5 border-b border-r border-border last:border-r-0',
                  !isCurrentMonth && 'opacity-40'
                )}
              >
                <span className={cn(
                  'text-xs font-medium inline-flex w-6 h-6 items-center justify-center rounded-full mb-1',
                  isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'
                )}>
                  {format(day, 'd')}
                </span>

                <div className="space-y-0.5">
                  {dayTasks.slice(0, 3).map((task) => {
                    const pc = PRIORITY_CONFIG[task.priority]
                    const overdue = isOverdue(task.due_date)
                    return (
                      <button
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className={cn(
                          'w-full text-left text-[10px] px-1.5 py-0.5 rounded font-medium truncate transition-opacity hover:opacity-80',
                          overdue ? 'bg-red-500/20 text-red-400' : `${pc.bg} ${pc.color}`
                        )}
                      >
                        {task.title}
                      </button>
                    )
                  })}
                  {dayTasks.length > 3 && (
                    <p className="text-[10px] text-muted-foreground px-1.5">+{dayTasks.length - 3} more</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {selectedTask && (
        <TaskDetailDialog task={selectedTask} open={!!selectedTask} onOpenChange={(o) => !o && setSelectedTask(null)} />
      )}
    </div>
  )
}
