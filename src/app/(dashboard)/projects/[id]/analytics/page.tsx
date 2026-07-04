import { getTasks } from '@/actions/tasks'
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard'
import type { Metadata } from 'next'

interface AnalyticsPageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Analytics' }

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { id } = await params
  const { data: tasks } = await getTasks(id)
  return <AnalyticsDashboard tasks={tasks} projectId={id} />
}
