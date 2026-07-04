'use client'

import { FolderKanban, Plus, Clock } from 'lucide-react'
import Link from 'next/link'
import { PRIORITY_CONFIG, formatRelative } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Project } from '@/types'

interface ProjectsOverviewProps {
  projects: Project[]
}

export function ProjectsOverview({ projects }: ProjectsOverviewProps) {
  if (!projects.length) {
    return (
      <div className="rounded-[20px] bg-card border border-border p-10 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-12 h-12 rounded-[16px] bg-muted flex items-center justify-center mb-4">
          <FolderKanban className="w-5 h-5 text-muted-foreground" />
        </div>
        <h3 className="text-foreground font-semibold mb-1">No Projects Yet</h3>
        <p className="text-muted-foreground text-sm mb-6">Create your first project to get started</p>
        <Link href="/projects">
          <button className="flex items-center gap-2 bg-foreground text-background font-medium text-sm px-6 py-2.5 rounded-full hover:bg-foreground/90 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Create Project
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[15px] font-semibold text-foreground">Active Projects</h3>
        <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {projects.map((project, i) => {
          const pc = PRIORITY_CONFIG[project.priority]
          const hash = project.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
          const progress = 30 + ((hash + i * 17) % 60)
          
          return (
            <Link
              key={project.id}
              href={`/projects/${project.id}/board`}
              className="block rounded-[20px] bg-card border border-border p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Left: Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-[12px] flex-shrink-0 flex items-center justify-center font-semibold text-sm text-white"
                    style={{ background: project.color }}>
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-foreground truncate">{project.name}</p>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${pc.bg} ${pc.color} border-0`}>{pc.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated {formatRelative(project.updated_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Progress & Team */}
                <div className="flex items-center gap-8">
                  {/* Progress */}
                  <div className="w-32 hidden md:block">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground font-medium">Progress</span>
                      <span className="text-foreground font-semibold">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>

              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
