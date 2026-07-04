'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ProjectInput } from '@/lib/validations'

export async function getProjects() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: [], error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      owner:profiles!projects_owner_id_fkey(*),
      project_members(*, profile:profiles!project_members_user_id_fkey(*))
    `)
    .order('created_at', { ascending: false })

  if (error) console.error("GET PROJECTS ERROR:", error)

  return { data: data ?? [], error: error?.message }
}

export async function getProject(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      owner:profiles!projects_owner_id_fkey(*),
      project_members(*, profile:profiles!project_members_user_id_fkey(*)),
      labels(*)
    `)
    .eq('id', id)
    .single()

  if (error) console.error("GET PROJECT ERROR:", error)

  return { data, error: error?.message }
}

export async function createProject(input: ProjectInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('projects')
    .insert({ ...input, owner_id: user.id })
    .select()
    .single()

  if (error) return { error: error.message }

  // Add creator as admin member
  await supabase.from('project_members').insert({
    project_id: data.id,
    user_id: user.id,
    role: 'admin',
  })

  // Log activity
  await supabase.from('activity_logs').insert({
    project_id: data.id,
    user_id: user.id,
    action: 'created_project',
    details: { project_name: data.name },
  })

  revalidatePath('/dashboard')
  revalidatePath('/projects')
  return { data }
}

export async function updateProject(id: string, input: Partial<ProjectInput>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('projects')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }

  await supabase.from('activity_logs').insert({
    project_id: id,
    user_id: user.id,
    action: 'updated_project',
    details: { changes: Object.keys(input) },
  })

  revalidatePath(`/projects/${id}`)
  return { data }
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  revalidatePath('/projects')
  return { success: true }
}

export async function inviteMember(projectId: string, email: string, role: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Find user by email
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  if (!profile) return { error: 'No user found with that email address.' }

  const { error } = await supabase.from('project_members').insert({
    project_id: projectId,
    user_id: profile.id,
    role,
    invited_by: user.id,
  })

  if (error) return { error: error.message }

  // Send notification
  await supabase.from('notifications').insert({
    user_id: profile.id,
    actor_id: user.id,
    type: 'project_invite',
    title: 'Project Invitation',
    body: `You've been invited to join a project`,
    resource_type: 'project',
    resource_id: projectId,
  })

  revalidatePath(`/projects/${projectId}`)
  return { success: true }
}

export async function removeMember(projectId: string, userId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('project_members')
    .delete()
    .eq('project_id', projectId)
    .eq('user_id', userId)

  if (error) return { error: error.message }
  revalidatePath(`/projects/${projectId}`)
  return { success: true }
}

export async function updateMemberRole(projectId: string, userId: string, role: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('project_members')
    .update({ role })
    .eq('project_id', projectId)
    .eq('user_id', userId)

  if (error) return { error: error.message }
  revalidatePath(`/projects/${projectId}`)
  return { success: true }
}
