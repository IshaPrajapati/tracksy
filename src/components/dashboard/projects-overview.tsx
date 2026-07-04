'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { FolderKanban, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { PRIORITY_CONFIG } from '@/lib/utils'
import type { Project } from '@/types'

interface ProjectsOverviewProps {
  projects: Project[]
}

export function ProjectsOverview({ projects }: ProjectsOverviewProps) {
  if (!projects.length) {
    return (
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><FolderKanban className="w-4 h-4" />Projects</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FolderKanban className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground mb-3">No projects yet</p>
            <Link href="/projects" className="text-sm text-primary hover:underline">Create your first project →</Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base"><FolderKanban className="w-4 h-4" />Projects</CardTitle>
        <Link href="/projects" className="text-xs text-primary hover:underline flex items-center gap-1">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {projects.map((project) => {
            const pc = PRIORITY_CONFIG[project.priority]
            return (
              <Link key={project.id} href={`/projects/${project.id}/board`}
                className="flex items-center gap-4 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-accent transition-all duration-200 group">
                <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-white text-sm"
                  style={{ background: project.color }}>
                  {project.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium truncate">{project.name}</p>
                    <Badge className={`${pc.bg} ${pc.color} border-0 text-xs py-0`}>{pc.label}</Badge>
                  </div>
                  {project.description && (
                    <p className="text-xs text-muted-foreground truncate">{project.description}</p>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
