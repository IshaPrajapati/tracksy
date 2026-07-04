'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { TaskInput } from '@/lib/validations'
import type { TaskStatus } from '@/types'

export async function getTasks(projectId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      assignee:profiles!tasks_assignee_id_fkey(*),
      creator:profiles!tasks_created_by_fkey(*),
      task_checklists(*),
      attachments(*)
    `)
    .eq('project_id', projectId)
    .eq('is_archived', false)
    .order('position', { ascending: true })

  return { data: data ?? [], error: error?.message }
}

export async function getTask(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      assignee:profiles!tasks_assignee_id_fkey(*),
      creator:profiles!tasks_created_by_fkey(*),
      task_checklists(*),
      attachments(*),
      comments(*, user:profiles(*), replies:comments(*, user:profiles(*)))
    `)
    .eq('id', id)
    .is('comments.parent_id', null)
    .single()

  return { data, error: error?.message }
}

export async function createTask(projectId: string, input: TaskInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Get max position for this status column
  const { data: lastTask } = await supabase
    .from('tasks')
    .select('position')
    .eq('project_id', projectId)
    .eq('status', input.status)
    .order('position', { ascending: false })
    .limit(1)
    .single()

  const position = lastTask ? lastTask.position + 1000 : 0

  const { data, error } = await supabase
    .from('tasks')
    .insert({ ...input, project_id: projectId, created_by: user.id, position })
    .select()
    .single()

  if (error) return { error: error.message }

  // Notify assignee
  if (data.assignee_id && data.assignee_id !== user.id) {
    await supabase.from('notifications').insert({
      user_id: data.assignee_id,
      actor_id: user.id,
      type: 'task_assigned',
      title: 'Task Assigned',
      body: `You've been assigned to "${data.title}"`,
      resource_type: 'task',
      resource_id: data.id,
    })
  }

  await supabase.from('activity_logs').insert({
    project_id: projectId,
    task_id: data.id,
    user_id: user.id,
    action: 'created_task',
    details: { task_title: data.title },
  })

  revalidatePath(`/projects/${projectId}`)
  return { data }
}

export async function updateTask(id: string, input: Partial<TaskInput & { position: number; is_archived: boolean }>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('tasks')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }

  // Notify assignee on reassignment
  if (input.assignee_id && input.assignee_id !== user.id) {
    await supabase.from('notifications').insert({
      user_id: input.assignee_id,
      actor_id: user.id,
      type: 'task_assigned',
      title: 'Task Assigned',
      body: `You've been assigned to "${data.title}"`,
      resource_type: 'task',
      resource_id: data.id,
    })
  }

  await supabase.from('activity_logs').insert({
    project_id: data.project_id,
    task_id: id,
    user_id: user.id,
    action: 'updated_task',
    details: { changes: Object.keys(input) },
  })

  revalidatePath(`/projects/${data.project_id}`)
  return { data }
}

export async function moveTask(id: string, newStatus: TaskStatus, newPosition: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('tasks')
    .update({ status: newStatus, position: newPosition })
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }

  await supabase.from('activity_logs').insert({
    project_id: data.project_id,
    task_id: id,
    user_id: user.id,
    action: 'moved_task',
    details: { new_status: newStatus },
  })

  revalidatePath(`/projects/${data.project_id}`)
  return { data }
}

export async function deleteTask(id: string, projectId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(`/projects/${projectId}`)
  return { success: true }
}

export async function duplicateTask(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: original } = await supabase.from('tasks').select('*').eq('id', id).single()
  if (!original) return { error: 'Task not found' }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...original,
      id: undefined,
      title: `${original.title} (Copy)`,
      created_by: user.id,
      position: original.position + 1,
      created_at: undefined,
      updated_at: undefined,
    })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath(`/projects/${original.project_id}`)
  return { data }
}

export async function archiveTask(id: string, projectId: string) {
  return updateTask(id, { is_archived: true })
}

// Checklists
export async function createChecklistItem(taskId: string, title: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('task_checklists')
    .insert({ task_id: taskId, title, position: Date.now() })
    .select()
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function updateChecklistItem(id: string, updates: { title?: string; is_completed?: boolean }) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('task_checklists')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function deleteChecklistItem(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('task_checklists').delete().eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}

// Comments
export async function createComment(taskId: string, content: string, parentId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: task } = await supabase.from('tasks').select('project_id, title, assignee_id').eq('id', taskId).single()

  const { data, error } = await supabase
    .from('comments')
    .insert({ task_id: taskId, user_id: user.id, content, parent_id: parentId ?? null })
    .select('*, user:profiles(*)')
    .single()

  if (error) return { error: error.message }

  // Notify task assignee
  if (task?.assignee_id && task.assignee_id !== user.id) {
    await supabase.from('notifications').insert({
      user_id: task.assignee_id,
      actor_id: user.id,
      type: 'comment_added',
      title: 'New Comment',
      body: `New comment on "${task.title}"`,
      resource_type: 'task',
      resource_id: taskId,
    })
  }

  await supabase.from('activity_logs').insert({
    project_id: task?.project_id,
    task_id: taskId,
    user_id: user.id,
    action: 'commented',
    details: {},
  })

  return { data }
}

export async function updateComment(id: string, content: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function deleteComment(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('comments').delete().eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}
