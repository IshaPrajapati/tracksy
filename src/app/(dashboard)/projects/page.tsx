import { getProjects } from '@/actions/projects'
import { ProjectCard } from '@/components/projects/project-card'
import { CreateProjectDialog } from '@/components/projects/create-project-dialog'
import { Button } from '@/components/ui/button'
import { Plus, FolderKanban } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Projects' }

export default async function ProjectsPage() {
  const { data: projects } = await getProjects()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <CreateProjectDialog>
          <Button id="create-project-btn">
            <Plus className="h-4 w-4 mr-2" />New Project
          </Button>
        </CreateProjectDialog>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
          <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-6">
            <FolderKanban className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">Create your first project to start organizing tasks and collaborating with your team.</p>
          <CreateProjectDialog>
            <Button size="lg"><Plus className="h-4 w-4 mr-2" />Create Project</Button>
          </CreateProjectDialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
