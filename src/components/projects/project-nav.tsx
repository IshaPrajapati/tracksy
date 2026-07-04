'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Kanban, List, Calendar, BarChart2, Settings, Users } from 'lucide-react'
import type { Project } from '@/types'
import { InviteMemberDialog } from './invite-member-dialog'
import { Button } from '@/components/ui/button'

interface ProjectNavProps {
  project: Project
}

export function ProjectNav({ project }: ProjectNavProps) {
  const pathname = usePathname()
  const base = `/projects/${project.id}`

  const tabs = [
    { href: `${base}/board`, label: 'Board', icon: Kanban },
    { href: `${base}/list`, label: 'List', icon: List },
    { href: `${base}/calendar`, label: 'Calendar', icon: Calendar },
    { href: `${base}/analytics`, label: 'Analytics', icon: BarChart2 },
  ]

  return (
    <div className="flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-lg"
          style={{ background: project.color }}>
          {project.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">{project.name}</h1>
          {project.description && <p className="text-xs text-muted-foreground">{project.description}</p>}
        </div>

        <nav className="flex items-center gap-1 ml-4 bg-muted/50 rounded-xl p-1">
          {tabs.map((tab) => (
            <Link key={tab.href} href={tab.href}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                pathname === tab.href || pathname.startsWith(tab.href)
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <InviteMemberDialog projectId={project.id}>
          <Button variant="outline" size="sm" id="invite-member-btn">
            <Users className="h-4 w-4 mr-2" />Invite
          </Button>
        </InviteMemberDialog>
      </div>
    </div>
  )
}
