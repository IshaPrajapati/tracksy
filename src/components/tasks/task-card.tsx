'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn, PRIORITY_CONFIG, STATUS_CONFIG, formatDate, isOverdue, getInitials } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar, CheckSquare, MessageSquare, Paperclip, GripVertical, MoreHorizontal, Copy, Archive, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useKanbanStore } from '@/store/kanban'
import { duplicateTask, deleteTask, archiveTask } from '@/actions/tasks'
import { toast } from 'sonner'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  isDragging?: boolean
}

export function TaskCard({ task, isDragging }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({ id: task.id })
  const { setSelectedTask } = useKanbanStore()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const pc = PRIORITY_CONFIG[task.priority]
  const overdue = isOverdue(task.due_date)
  const completedItems = task.checklists?.filter((c) => c.is_completed).length ?? 0
  const totalItems = task.checklists?.length ?? 0

  async function handleDuplicate(e: React.MouseEvent) {
    e.stopPropagation()
    const result = await duplicateTask(task.id)
    if (result.error) toast.error(result.error)
    else toast.success('Task duplicated')
  }

  async function handleArchive(e: React.MouseEvent) {
    e.stopPropagation()
    const result = await archiveTask(task.id, task.project_id)
    if (result.error) toast.error(result.error)
    else toast.success('Task archived')
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm('Delete this task?')) return
    const result = await deleteTask(task.id, task.project_id)
    if (result.error) toast.error(result.error)
    else toast.success('Task deleted')
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'task-card group bg-card border border-border rounded-xl p-3 cursor-pointer select-none',
        (isDragging || isSortableDragging) && 'opacity-50 rotate-2 shadow-2xl',
      )}
      onClick={() => setSelectedTask(task)}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="mt-0.5 text-muted-foreground/50 hover:text-muted-foreground cursor-grab active:cursor-grabbing flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <p className="text-sm font-medium leading-snug flex-1 min-w-0">{task.title}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={handleDuplicate}><Copy className="w-4 h-4 mr-2" />Duplicate</DropdownMenuItem>
            <DropdownMenuItem onClick={handleArchive}><Archive className="w-4 h-4 mr-2" />Archive</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Priority badge */}
      <Badge className={cn(pc.bg, pc.color, 'border-0 text-xs mb-2')}>{pc.label}</Badge>

      {/* Labels */}
      {task.label_ids && task.label_ids.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.label_ids.map((id) => (
            <span key={id} className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full">{id.slice(0, 6)}</span>
          ))}
        </div>
      )}

      {/* Metadata row */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          {task.due_date && (
            <span className={cn('flex items-center gap-1 text-[11px]', overdue && 'text-red-400')}>
              <Calendar className="w-3 h-3" />
              {formatDate(task.due_date)}
            </span>
          )}
          {totalItems > 0 && (
            <span className="flex items-center gap-1 text-[11px]">
              <CheckSquare className="w-3 h-3" />
              {completedItems}/{totalItems}
            </span>
          )}
          {(task.comments?.length ?? 0) > 0 && (
            <span className="flex items-center gap-1 text-[11px]">
              <MessageSquare className="w-3 h-3" />
              {task.comments!.length}
            </span>
          )}
          {(task.attachments?.length ?? 0) > 0 && (
            <span className="flex items-center gap-1 text-[11px]">
              <Paperclip className="w-3 h-3" />
              {task.attachments!.length}
            </span>
          )}
        </div>

        {task.assignee && (
          <Avatar className="w-6 h-6 flex-shrink-0">
            <AvatarImage src={task.assignee.avatar_url ?? ''} />
            <AvatarFallback className="text-[9px]">{getInitials(task.assignee.full_name)}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  )
}
