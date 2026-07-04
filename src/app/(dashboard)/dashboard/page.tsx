import { getDashboardStats, getRecentActivity } from '@/actions/user'
import { getProjects } from '@/actions/projects'
import { getTasks } from '@/actions/tasks'
import { createClient } from '@/lib/supabase/server'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { UpcomingDeadlines } from '@/components/dashboard/upcoming-deadlines'
import { ProjectsOverview } from '@/components/dashboard/projects-overview'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [stats, activityResult, projectsResult] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(10),
    getProjects(),
  ])

  // Gather tasks for all projects (up to 3 projects for overview)
  const projects = projectsResult.data?.slice(0, 6) ?? []

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProjectsOverview projects={projects} />
          <RecentActivity activities={activityResult.data} />
        </div>
        <div>
          <UpcomingDeadlines />
        </div>
      </div>
    </div>
  )
}
