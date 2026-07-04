'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  DndContext, DragEndEvent, DragStartEvent,
  DragOverlay, PointerSensor, useSensor, useSensors, closestCorners
} from '@dnd-kit/core'
import { createClient } from '@/lib/supabase/client'
import { useKanbanStore } from '@/store/kanban'
import { KanbanColumn } from './kanban-column'
import { TaskCard } from '../tasks/task-card'
import { TaskDetailDialog } from '../tasks/task-detail-dialog'
import { moveTask } from '@/actions/tasks'
import { KANBAN_COLUMNS } from '@/lib/utils'
import { toast } from 'sonner'
import type { Task, TaskStatus } from '@/types'

interface KanbanBoardProps {
  projectId: string
  initialTasks: Task[]
  members: any[]
}

export function KanbanBoard({ projectId, initialTasks, members }: KanbanBoardProps) {
  const { columns, activeTask, selectedTask, setTasks, moveTask: optimisticMove, setActiveTask, setSelectedTask } = useKanbanStore()
  const router = useRouter()
  const searchParams = useSearchParams()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks, setTasks])

  // Handle URL param to auto-open task dialog
  useEffect(() => {
    const taskId = searchParams.get('taskId')
    if (taskId && columns.length > 0) {
      const task = columns.flatMap((c) => c.tasks).find((t) => t.id === taskId)
      if (task && (!selectedTask || selectedTask.id !== task.id)) {
        setSelectedTask(task)
      }
    }
  }, [searchParams, columns, selectedTask, setSelectedTask])

  // Clear URL param when dialog closes
  function handleDialogChange(open: boolean) {
    if (!open) {
      setSelectedTask(null)
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('taskId')
      router.replace(newUrl.pathname + newUrl.search)
    }
  }

  // Real-time subscription
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`project-tasks-${projectId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks', filter: `project_id=eq.${projectId}` },
        async () => {
          // Re-fetch tasks
          const { data } = await supabase
            .from('tasks')
            .select('*, assignee:profiles!tasks_assignee_id_fkey(*), creator:profiles!tasks_created_by_fkey(*)')
            .eq('project_id', projectId)
            .eq('is_archived', false)
            .order('position', { ascending: true })
          if (data) setTasks(data as Task[])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [projectId, setTasks])

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const task = columns.flatMap((c) => c.tasks).find((t) => t.id === active.id)
    setActiveTask(task ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTask(null)
    if (!over) return

    const activeTask = columns.flatMap((c) => c.tasks).find((t) => t.id === active.id)
    if (!activeTask) return

    // Determine target column
    const overColumn = KANBAN_COLUMNS.find((c) => c.id === over.id)
    const overTask = columns.flatMap((c) => c.tasks).find((t) => t.id === over.id)
    const targetStatus = (overColumn?.id ?? overTask?.status ?? activeTask.status) as TaskStatus

    const targetColumn = columns.find((c) => c.id === targetStatus)
    const newPosition = targetColumn ? (targetColumn.tasks.length + 1) * 1000 : 0

    if (targetStatus !== activeTask.status) {
      optimisticMove(activeTask.id, activeTask.status, targetStatus, newPosition)
      moveTask(activeTask.id, targetStatus, newPosition).then((r) => {
        if (r.error) toast.error('Failed to move task')
      })
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1 min-h-0">
          {columns.map((column) => (
            <KanbanColumn key={column.id} column={column} projectId={projectId} members={members} />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={handleDialogChange}
        />
      )}
    </>
  )
}
