'use client'

import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PRIORITY_CONFIG, STATUS_CONFIG, formatDate, getInitials, isOverdue } from '@/lib/utils'
import { CreateTaskDialog } from './create-task-dialog'
import { TaskDetailDialog } from './task-detail-dialog'
import { Plus, Filter, Calendar, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task, TaskStatus, Priority } from '@/types'

interface TaskListViewProps {
  tasks: Task[]
  projectId: string
  members: any[]
}

export function TaskListView({ tasks, projectId, members }: TaskListViewProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const filtered = useMemo(() => {
    return tasks
      .filter((t) => filterStatus === 'all' || t.status === filterStatus)
      .filter((t) => filterPriority === 'all' || t.priority === filterPriority)
      .sort((a, b) => {
        if (sortBy === 'due_date') return (a.due_date ?? '').localeCompare(b.due_date ?? '')
        if (sortBy === 'priority') {
          const order = { urgent: 0, high: 1, medium: 2, low: 3 }
          return order[a.priority] - order[b.priority]
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
  }, [tasks, filterStatus, filterPriority, sortBy])

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36 h-8 text-xs" id="filter-status"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="backlog">Backlog</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-36 h-8 text-xs" id="filter-priority"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-36 h-8 text-xs" id="sort-by"><SelectValue placeholder="Sort by" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Newest First</SelectItem>
            <SelectItem value="due_date">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</span>

        <CreateTaskDialog projectId={projectId} members={members}>
          <Button size="sm" id="list-create-task"><Plus className="h-4 w-4 mr-1.5" />Add Task</Button>
        </CreateTaskDialog>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Task</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Priority</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Assignee</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((task, idx) => {
              const pc = PRIORITY_CONFIG[task.priority]
              const sc = STATUS_CONFIG[task.status]
              const overdue = isOverdue(task.due_date)
              return (
                <tr
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={cn(
                    'border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-accent/50',
                    idx % 2 === 0 ? '' : 'bg-muted/10'
                  )}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{task.title}</p>
                    {task.description && <p className="text-xs text-muted-foreground truncate max-w-xs">{task.description}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={cn(sc.bg, sc.color, 'border-0 text-xs')}>{sc.label}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={cn(pc.bg, pc.color, 'border-0 text-xs')}>{pc.label}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={task.assignee.avatar_url ?? ''} />
                          <AvatarFallback className="text-[9px]">{getInitials(task.assignee.full_name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{task.assignee.full_name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs flex items-center gap-1', overdue && 'text-red-400')}>
                      {task.due_date ? (
                        <><Calendar className="w-3 h-3" />{formatDate(task.due_date)}</>
                      ) : '—'}
                    </span>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground text-sm">
                  No tasks match the current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedTask && (
        <TaskDetailDialog task={selectedTask} open={!!selectedTask} onOpenChange={(o) => !o && setSelectedTask(null)} />
      )}
    </div>
  )
}
