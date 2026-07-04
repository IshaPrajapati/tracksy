import { getTasks } from '@/actions/tasks'
import { CalendarView } from '@/components/calendar/calendar-view'
import type { Metadata } from 'next'

interface CalendarPageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Calendar' }

export default async function CalendarPage({ params }: CalendarPageProps) {
  const { id } = await params
  const { data: tasks } = await getTasks(id)
  return <CalendarView tasks={tasks} projectId={id} />
}
