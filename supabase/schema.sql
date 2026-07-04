-- ============================================================
-- TaskFlow Pro — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ============================================================
-- 1. CREATE TABLES
-- ============================================================

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  color text default '#6366f1',
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  status text default 'active' check (status in ('active', 'archived', 'completed')),
  start_date date,
  end_date date,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table public.project_members (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text default 'member' check (role in ('admin', 'manager', 'member')),
  invited_by uuid references public.profiles(id),
  joined_at timestamptz default now() not null,
  unique(project_id, user_id)
);

create table public.labels (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  name text not null,
  color text default '#6366f1',
  created_at timestamptz default now() not null
);

create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  description text,
  status text default 'backlog' check (status in ('backlog', 'todo', 'in_progress', 'review', 'completed')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  assignee_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null not null,
  due_date timestamptz,
  position integer default 0,
  is_archived boolean default false,
  label_ids uuid[] default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table public.task_checklists (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  title text not null,
  is_completed boolean default false,
  position integer default 0,
  created_at timestamptz default now() not null
);

create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  parent_id uuid references public.comments(id) on delete cascade,
  content text not null,
  mentions uuid[] default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table public.attachments (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  uploaded_by uuid references public.profiles(id) on delete set null not null,
  file_name text not null,
  file_size bigint,
  file_type text,
  storage_path text not null,
  url text,
  created_at timestamptz default now() not null
);

create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  actor_id uuid references public.profiles(id) on delete set null,
  type text not null check (type in (
    'task_assigned', 'task_updated', 'comment_added',
    'project_invite', 'mention', 'task_due_soon'
  )),
  title text not null,
  body text,
  resource_type text check (resource_type in ('task', 'project', 'comment')),
  resource_id uuid,
  is_read boolean default false,
  created_at timestamptz default now() not null
);

create table public.activity_logs (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null not null,
  action text not null,
  details jsonb default '{}',
  created_at timestamptz default now() not null
);

create table public.contact_messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  company text,
  message text not null,
  created_at timestamptz default now() not null,
  status text default 'unread' check (status in ('unread', 'read', 'archived'))
);

-- ============================================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.labels enable row level security;
alter table public.tasks enable row level security;
alter table public.task_checklists enable row level security;
alter table public.comments enable row level security;
alter table public.attachments enable row level security;
alter table public.notifications enable row level security;
alter table public.activity_logs enable row level security;
alter table public.contact_messages enable row level security;

-- ============================================================
-- 3. HELPER FUNCTIONS (Avoids Infinite Recursion)
-- ============================================================

create or replace function public.is_project_member(p_project_id uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from project_members
    where project_id = p_project_id and user_id = auth.uid()
  );
$$;

create or replace function public.is_project_admin(p_project_id uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from project_members
    where project_id = p_project_id and user_id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_project_owner(p_project_id uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from projects
    where id = p_project_id and owner_id = auth.uid()
  );
$$;

-- ============================================================
-- 4. RLS POLICIES
-- ============================================================

-- PROFILES
create policy "Users can view all profiles" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- PROJECTS
create policy "Members can view projects" on public.projects for select using (
  auth.uid() = owner_id or public.is_project_member(id)
);
create policy "Owners can update projects" on public.projects for update using (auth.uid() = owner_id);
create policy "Authenticated users can create projects" on public.projects for insert with check (auth.uid() = owner_id);
create policy "Owners can delete projects" on public.projects for delete using (auth.uid() = owner_id);

-- PROJECT MEMBERS
create policy "Members can view project members" on public.project_members for select using (
  user_id = auth.uid() or public.is_project_owner(project_id) or public.is_project_member(project_id)
);
create policy "Admins/owners can manage members" on public.project_members for all using (
  public.is_project_owner(project_id) or public.is_project_admin(project_id)
);

-- LABELS
create policy "Members can manage labels" on public.labels for all using (
  public.is_project_owner(project_id) or public.is_project_member(project_id)
);

-- TASKS
create policy "Project members can view tasks" on public.tasks for select using (
  public.is_project_owner(project_id) or public.is_project_member(project_id)
);
create policy "Project members can create tasks" on public.tasks for insert with check (
  auth.uid() = created_by and (public.is_project_owner(project_id) or public.is_project_member(project_id))
);
create policy "Project members can update tasks" on public.tasks for update using (
  public.is_project_owner(project_id) or public.is_project_member(project_id)
);
create policy "Task creator or project owner can delete" on public.tasks for delete using (
  auth.uid() = created_by or public.is_project_owner(project_id)
);

-- TASK CHECKLISTS
create policy "Task members can manage checklists" on public.task_checklists for all using (
  exists (
    select 1 from public.tasks t
    where t.id = task_checklists.task_id
    and (public.is_project_owner(t.project_id) or public.is_project_member(t.project_id))
  )
);

-- COMMENTS
create policy "Project members can view comments" on public.comments for select using (
  exists (
    select 1 from public.tasks t
    where t.id = comments.task_id
    and (public.is_project_owner(t.project_id) or public.is_project_member(t.project_id))
  )
);
create policy "Project members can create comments" on public.comments for insert with check (
  auth.uid() = user_id and
  exists (
    select 1 from public.tasks t
    where t.id = comments.task_id
    and (public.is_project_owner(t.project_id) or public.is_project_member(t.project_id))
  )
);
create policy "Comment owner can update" on public.comments for update using (auth.uid() = user_id);
create policy "Comment owner can delete" on public.comments for delete using (auth.uid() = user_id);

-- ATTACHMENTS
create policy "Project members can manage attachments" on public.attachments for all using (
  exists (
    select 1 from public.tasks t
    where t.id = attachments.task_id
    and (public.is_project_owner(t.project_id) or public.is_project_member(t.project_id))
  )
);

-- NOTIFICATIONS
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "System can insert notifications" on public.notifications for insert with check (true);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);

-- ACTIVITY LOGS
create policy "Project members can view activity" on public.activity_logs for select using (
  public.is_project_owner(project_id) or public.is_project_member(project_id)
);
create policy "Authenticated users can insert activity" on public.activity_logs for insert with check (auth.uid() = user_id);

-- CONTACT MESSAGES
create policy "Anyone can insert contact messages" on public.contact_messages for insert with check (true);
create policy "Only authenticated users can view messages" on public.contact_messages for select using (auth.role() = 'authenticated');

-- ============================================================
-- 5. TRIGGERS
-- ============================================================

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at_profiles before update on public.profiles for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at_projects before update on public.projects for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at_tasks before update on public.tasks for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at_comments before update on public.comments for each row execute procedure public.handle_updated_at();

-- ============================================================
-- 6. INDEXES
-- ============================================================
create index if not exists idx_tasks_project_id on public.tasks(project_id);
create index if not exists idx_tasks_assignee_id on public.tasks(assignee_id);
create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_tasks_due_date on public.tasks(due_date);
create index if not exists idx_project_members_user_id on public.project_members(user_id);
create index if not exists idx_project_members_project_id on public.project_members(project_id);
create index if not exists idx_comments_task_id on public.comments(task_id);
create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_activity_logs_project_id on public.activity_logs(project_id);
create index if not exists idx_activity_logs_task_id on public.activity_logs(task_id);

-- Full-text search indexes
create index if not exists idx_tasks_title_fts on public.tasks using gin(to_tsvector('english', title));
create index if not exists idx_projects_name_fts on public.projects using gin(to_tsvector('english', name));

-- ============================================================
-- 7. STORAGE BUCKETS
-- ============================================================
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('attachments', 'attachments', false) on conflict (id) do nothing;

drop policy if exists "Avatar images are publicly accessible" on storage.objects;
drop policy if exists "Users can upload avatars" on storage.objects;
drop policy if exists "Users can update own avatar" on storage.objects;
drop policy if exists "Project members can upload attachments" on storage.objects;
drop policy if exists "Project members can view attachments" on storage.objects;

create policy "Avatar images are publicly accessible" on storage.objects for select using (bucket_id = 'avatars');
create policy "Users can upload avatars" on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users can update own avatar" on storage.objects for update using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Project members can upload attachments" on storage.objects for insert with check (bucket_id = 'attachments' and auth.role() = 'authenticated');
create policy "Project members can view attachments" on storage.objects for select using (bucket_id = 'attachments' and auth.role() = 'authenticated');
