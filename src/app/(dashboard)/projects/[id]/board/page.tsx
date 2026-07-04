import { getTasks } from '@/actions/tasks'
import { getProject } from '@/actions/projects'
import { KanbanBoard } from '@/components/kanban/kanban-board'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface BoardPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: BoardPageProps): Promise<Metadata> {
  const { id } = await params
  const { data: project } = await getProject(id)
  return { title: project ? `${project.name} — Board` : 'Board' }
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { id } = await params
  const [projectResult, tasksResult] = await Promise.all([getProject(id), getTasks(id)])
  if (!projectResult.data) notFound()

  return (
    <KanbanBoard
      projectId={id}
      initialTasks={tasksResult.data}
      members={(projectResult.data as any).project_members ?? []}
    />
  )
}
