import { getProject } from '@/actions/projects'
import { notFound } from 'next/navigation'
import { ProjectNav } from '@/components/projects/project-nav'

interface ProjectLayoutProps {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { id } = await params
  const { data: project } = await getProject(id)
  if (!project) notFound()

  return (
    <div className="flex flex-col h-full space-y-4 -m-6 p-6">
      <ProjectNav project={project} />
      {children}
    </div>
  )
}
