'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ProfileInput } from '@/lib/validations'

export async function getProfile(userId?: string) {
  const supabase = await createClient()
  const id = userId ?? (await supabase.auth.getUser()).data.user?.id
  if (!id) return { data: null, error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  return { data, error: error?.message }
}

export async function updateProfile(input: ProfileInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('profiles')
    .update(input)
    .eq('id', user.id)
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath('/profile')
  return { data }
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const file = formData.get('avatar') as File
  if (!file) return { error: 'No file provided' }

  const ext = file.name.split('.').pop()
  const path = `${user.id}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })

  if (uploadError) return { error: uploadError.message }

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(path)

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id)

  if (updateError) return { error: updateError.message }

  revalidatePath('/profile')
  return { url: publicUrl }
}

export async function getDashboardStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [projectsResult, tasksResult] = await Promise.all([
    supabase
      .from('projects')
      .select('id', { count: 'exact' })
      .or(`owner_id.eq.${user.id}`),
    supabase
      .from('tasks')
      .select('id, status, due_date, project_id', { count: 'exact' })
      .eq('is_archived', false),
  ])

  const tasks = tasksResult.data ?? []
  const now = new Date().toISOString()
  const completedTasks = tasks.filter((t) => t.status === 'completed').length
  const overdueTasks = tasks.filter((t) => t.due_date && t.due_date < now && t.status !== 'completed').length

  return {
    totalProjects: projectsResult.count ?? 0,
    totalTasks: tasks.length,
    completedTasks,
    pendingTasks: tasks.length - completedTasks,
    overdueTasks,
    completionRate: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0,
  }
}

export async function getRecentActivity(limit = 20) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*, user:profiles(*)')
    .order('created_at', { ascending: false })
    .limit(limit)

  return { data: data ?? [], error: error?.message }
}

export async function getNotifications() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: [] }

  const { data, error } = await supabase
    .from('notifications')
    .select('*, actor:profiles!notifications_actor_id_fkey(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return { data: data ?? [], error: error?.message }
}

export async function markNotificationRead(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)

  if (error) return { error: error.message }
  return { success: true }
}

export async function markAllNotificationsRead() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  return { success: true }
}

export async function globalSearch(query: string) {
  const supabase = await createClient()
  if (!query.trim()) return { projects: [], tasks: [], users: [] }

  const [projectsRes, tasksRes, usersRes] = await Promise.all([
    supabase.from('projects').select('id, name, color').ilike('name', `%${query}%`).limit(5),
    supabase.from('tasks').select('id, title, project_id, status').ilike('title', `%${query}%`).limit(10),
    supabase.from('profiles').select('id, full_name, email, avatar_url').ilike('full_name', `%${query}%`).limit(5),
  ])

  return {
    projects: projectsRes.data ?? [],
    tasks: tasksRes.data ?? [],
    users: usersRes.data ?? [],
  }
}
