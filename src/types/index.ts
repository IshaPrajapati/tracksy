// ============================================================
// TypeScript Types — Tracksy
// ============================================================

export type UserRole = 'admin' | 'manager' | 'member'
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'completed'
export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export type ProjectStatus = 'active' | 'archived' | 'completed'
export type NotificationType =
  | 'task_assigned'
  | 'task_updated'
  | 'comment_added'
  | 'project_invite'
  | 'mention'
  | 'task_due_soon'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description: string | null
  color: string
  priority: Priority
  status: ProjectStatus
  start_date: string | null
  end_date: string | null
  owner_id: string
  created_at: string
  updated_at: string
  // joined
  owner?: Profile
  members?: ProjectMember[]
  tasks?: Task[]
  _count?: {
    tasks: number
    members: number
  }
}

export interface ProjectMember {
  id: string
  project_id: string
  user_id: string
  role: UserRole
  invited_by: string | null
  joined_at: string
  // joined
  profile?: Profile
}

export interface Label {
  id: string
  project_id: string
  name: string
  color: string
  created_at: string
}

export interface Task {
  id: string
  project_id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority
  assignee_id: string | null
  created_by: string
  due_date: string | null
  position: number
  is_archived: boolean
  label_ids: string[]
  created_at: string
  updated_at: string
  // joined
  assignee?: Profile
  creator?: Profile
  project?: Project
  checklists?: TaskChecklist[]
  comments?: Comment[]
  attachments?: Attachment[]
  labels?: Label[]
}

export interface TaskChecklist {
  id: string
  task_id: string
  title: string
  is_completed: boolean
  position: number
  created_at: string
}

export interface Comment {
  id: string
  task_id: string
  user_id: string
  parent_id: string | null
  content: string
  mentions: string[]
  created_at: string
  updated_at: string
  // joined
  user?: Profile
  replies?: Comment[]
}

export interface Attachment {
  id: string
  task_id: string
  uploaded_by: string
  file_name: string
  file_size: number | null
  file_type: string | null
  storage_path: string
  url: string | null
  created_at: string
  // joined
  uploader?: Profile
}

export interface Notification {
  id: string
  user_id: string
  actor_id: string | null
  type: NotificationType
  title: string
  body: string | null
  resource_type: 'task' | 'project' | 'comment' | null
  resource_id: string | null
  is_read: boolean
  created_at: string
  // joined
  actor?: Profile
}

export interface ActivityLog {
  id: string
  project_id: string | null
  task_id: string | null
  user_id: string
  action: string
  details: Record<string, unknown>
  created_at: string
  // joined
  user?: Profile
}

// Kanban board
export interface KanbanColumn {
  id: TaskStatus
  title: string
  color: string
  tasks: Task[]
}

// Stats for dashboard
export interface DashboardStats {
  totalProjects: number
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
  completionRate: number
}

// Search
export interface SearchResult {
  type: 'project' | 'task' | 'user'
  id: string
  title: string
  subtitle?: string
  url: string
  icon?: string
}
