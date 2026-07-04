'use client'

import Link from 'next/link'
import { formatDate, PRIORITY_CONFIG } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { MoreHorizontal, Kanban, Users, Calendar, Trash2, Edit } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { deleteProject } from '@/actions/projects'
import { toast } from 'sonner'
import { useState } from 'react'
import { EditProjectDialog } from './edit-project-dialog'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const pc = PRIORITY_CONFIG[project.priority]
  const members = (project as any).project_members ?? []

  async function handleDelete() {
    if (!confirm('Delete this project? This cannot be undone.')) return
    setIsDeleting(true)
    const result = await deleteProject(project.id)
    if (result.error) {
      toast.error(result.error)
      setIsDeleting(false)
    } else {
      toast.success('Project deleted')
    }
  }

  return (
    <div className="group rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Color bar */}
      <div className="h-1.5 w-full" style={{ background: project.color }} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-white text-sm shadow-lg"
              style={{ background: project.color }}>
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-tight">{project.name}</h3>
              <Badge className={`${pc.bg} ${pc.color} border-0 text-xs mt-1`}>{pc.label}</Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <EditProjectDialog project={project}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="w-4 h-4 mr-2" />Edit Project
                </DropdownMenuItem>
              </EditProjectDialog>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {project.description && (
          <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
        )}

        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          {project.end_date && (
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(project.end_date)}</span>
          )}
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{members.length} member{members.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Members avatars */}
        {members.length > 0 && (
          <div className="flex items-center gap-1 mb-4">
            {members.slice(0, 5).map((m: any) => (
              <Avatar key={m.id} className="w-6 h-6 -ml-1 first:ml-0 ring-1 ring-card">
                <AvatarImage src={m.profile?.avatar_url ?? ''} />
                <AvatarFallback className="text-[9px]">{getInitials(m.profile?.full_name)}</AvatarFallback>
              </Avatar>
            ))}
            {members.length > 5 && (
              <span className="text-xs text-muted-foreground ml-1">+{members.length - 5}</span>
            )}
          </div>
        )}

        <Link href={`/projects/${project.id}/board`}
          className="flex items-center gap-2 text-xs font-medium text-primary hover:underline transition-colors">
          <Kanban className="w-3.5 h-3.5" />Open Board
        </Link>
      </div>
    </div>
  )
}
