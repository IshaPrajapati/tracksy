import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Task, KanbanColumn, TaskStatus } from '@/types'
import { KANBAN_COLUMNS } from '@/lib/utils'

interface KanbanState {
  columns: KanbanColumn[]
  isLoading: boolean
  activeTask: Task | null
  selectedTask: Task | null
  setTasks: (tasks: Task[]) => void
  moveTask: (taskId: string, fromStatus: TaskStatus, toStatus: TaskStatus, newPosition: number) => void
  addTask: (task: Task) => void
  updateTask: (task: Task) => void
  removeTask: (taskId: string, status: TaskStatus) => void
  setActiveTask: (task: Task | null) => void
  setSelectedTask: (task: Task | null) => void
  setLoading: (loading: boolean) => void
}

export const useKanbanStore = create<KanbanState>()(
  devtools((set) => ({
    columns: KANBAN_COLUMNS.map((col) => ({ ...col, tasks: [] })),
    isLoading: false,
    activeTask: null,
    selectedTask: null,

    setTasks: (tasks) =>
      set((state) => ({
        columns: KANBAN_COLUMNS.map((col) => ({
          ...col,
          tasks: tasks
            .filter((t) => t.status === col.id)
            .sort((a, b) => a.position - b.position),
        })),
      })),

    moveTask: (taskId, fromStatus, toStatus, newPosition) =>
      set((state) => {
        const newColumns = state.columns.map((col) => {
          if (col.id === fromStatus) {
            return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
          }
          if (col.id === toStatus) {
            const task = state.columns
              .find((c) => c.id === fromStatus)
              ?.tasks.find((t) => t.id === taskId)
            if (!task) return col
            const updatedTask = { ...task, status: toStatus, position: newPosition }
            const newTasks = [...col.tasks, updatedTask].sort((a, b) => a.position - b.position)
            return { ...col, tasks: newTasks }
          }
          return col
        })
        return { columns: newColumns }
      }),

    addTask: (task) =>
      set((state) => ({
        columns: state.columns.map((col) =>
          col.id === task.status
            ? { ...col, tasks: [...col.tasks, task].sort((a, b) => a.position - b.position) }
            : col
        ),
      })),

    updateTask: (task) =>
      set((state) => ({
        columns: state.columns.map((col) => ({
          ...col,
          tasks: col.tasks.map((t) => (t.id === task.id ? task : t)),
        })),
      })),

    removeTask: (taskId, status) =>
      set((state) => ({
        columns: state.columns.map((col) =>
          col.id === status
            ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
            : col
        ),
      })),

    setActiveTask: (activeTask) => set({ activeTask }),
    setSelectedTask: (selectedTask) => set({ selectedTask }),
    setLoading: (isLoading) => set({ isLoading }),
  }), { name: 'kanban-store' })
)
