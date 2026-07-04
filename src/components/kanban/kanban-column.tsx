'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TaskCard } from '../tasks/task-card'
import { CreateTaskDialog } from '../tasks/create-task-dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { KanbanColumn as KanbanColumnType } from '@/types'

interface KanbanColumnProps {
  column: KanbanColumnType
  projectId: string
  members: any[]
}

export function KanbanColumn({ column, projectId, members }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div className="flex flex-col w-72 flex-shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: column.color }} />
          <span className="text-sm font-semibold">{column.title}</span>
          <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5 font-medium">
            {column.tasks.length}
          </span>
        </div>
        <CreateTaskDialog projectId={projectId} defaultStatus={column.id} members={members}>
          <Button variant="ghost" size="icon-sm" id={`add-task-${column.id}`}>
            <Plus className="h-4 w-4" />
          </Button>
        </CreateTaskDialog>
      </div>

      {/* Droppable area */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 flex flex-col gap-2 min-h-[200px] p-2 rounded-2xl border-2 border-dashed transition-all duration-200',
          isOver
            ? 'border-primary/60 bg-primary/5'
            : 'border-transparent bg-muted/30'
        )}
      >
        <SortableContext
          items={column.tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {column.tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground py-8">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  )
}
