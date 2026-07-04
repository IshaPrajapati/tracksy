import { getDashboardStats, getRecentActivity } from '@/actions/user'
import { getProjects } from '@/actions/projects'
import { createClient } from '@/lib/supabase/server'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { ProjectsOverview } from '@/components/dashboard/projects-overview'
import { SmartInsights } from '@/components/dashboard/smart-insights'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [stats, activityResult, projectsResult] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(12),
    getProjects(),
  ])

  const projects = projectsResult.data?.slice(0, 6) ?? []
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-[36px] font-bold text-foreground tracking-tight leading-tight">
          Welcome back, {firstName} <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="text-muted-foreground text-[15px] mt-1.5">
          Here's a quick overview of your workspace today.
        </p>
      </div>

      {/* Stats Grid */}
      <StatsCards stats={stats} />

      {/* Smart Insights */}
      <SmartInsights stats={stats} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProjectsOverview projects={projects} />
        </div>
        <div className="space-y-6">

          <RecentActivity activities={activityResult.data ?? []} />
        </div>
      </div>
    </div>
  )
}
