import { getTasks } from '@/actions/tasks'
import { TaskListView } from '@/components/tasks/task-list-view'
import { getProject } from '@/actions/projects'
import type { Metadata } from 'next'

interface ListPageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Task List' }

export default async function ListPage({ params }: ListPageProps) {
  const { id } = await params
  const [{ data: tasks }, { data: project }] = await Promise.all([getTasks(id), getProject(id)])
  const members = (project as any)?.project_members ?? []
  return <TaskListView tasks={tasks} projectId={id} members={members} />
}
