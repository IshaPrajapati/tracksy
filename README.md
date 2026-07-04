# Tracksy 🚀

A production-ready, full-stack Project Management SaaS built with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## ✨ Features

- **Authentication** — Sign up, sign in, forgot/reset password, email verification
- **User Profiles** — Avatar upload, bio, change password
- **Dashboard** — Stats, recent activity, upcoming deadlines
- **Projects** — Create/edit/delete, invite team members, assign roles
- **Kanban Board** — Drag-and-drop with real-time updates (Supabase Realtime)
- **Task Management** — Rich tasks with assignee, priority, due date, labels, checklists, attachments
- **Comments** — Threaded comments with @mentions
- **Notifications** — Real-time notifications for assignments, comments, invites
- **Search** — Global search across projects, tasks, users
- **Calendar View** — Tasks plotted by due date
- **Analytics** — Charts for task completion, priority distribution, team productivity
- **Dark/Light Mode** — Full dark mode support

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Realtime | Supabase Realtime |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Drag & Drop | @dnd-kit |
| Charts | Recharts |
| Dates | date-fns |
| Notifications | Sonner |

## 🚀 Getting Started

### 1. Clone and install

```bash
cd taskflow-pro
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your project, go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Go to **Project Settings → API** and copy your credentials

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, register, forgot/reset password
│   ├── (dashboard)/     # Protected app pages
│   │   ├── dashboard/   # Main dashboard
│   │   ├── projects/    # Project list
│   │   │   └── [id]/    # Project detail
│   │   │       ├── board/      # Kanban board
│   │   │       ├── list/       # Task list view
│   │   │       ├── calendar/   # Calendar view
│   │   │       └── analytics/  # Project analytics
│   │   ├── profile/     # User profile
│   │   └── notifications/
│   └── auth/callback/   # Supabase auth callback
├── actions/             # Next.js Server Actions
├── components/
│   ├── ui/              # Base UI components
│   ├── auth/            # Auth form components
│   ├── dashboard/       # Dashboard widgets
│   ├── projects/        # Project components
│   ├── tasks/           # Task components
│   ├── kanban/          # Kanban board
│   ├── calendar/        # Calendar view
│   ├── analytics/       # Charts & analytics
│   ├── notifications/   # Notification components
│   ├── profile/         # Profile components
│   └── shared/          # Sidebar, Topbar, etc.
├── lib/
│   ├── supabase/        # Supabase client config
│   ├── validations/     # Zod schemas
│   └── utils.ts         # Utility functions
├── store/               # Zustand stores
└── types/               # TypeScript types
```

## 🗄 Database Schema

Run `supabase/schema.sql` in your Supabase SQL Editor. It creates:

- `profiles` — User profiles (auto-created on sign up)
- `projects` — Project data
- `project_members` — Team membership with roles
- `labels` — Reusable task labels
- `tasks` — Task data
- `task_checklists` — Checklist items per task
- `comments` — Task comments with replies
- `attachments` — File metadata
- `notifications` — User notifications
- `activity_logs` — Audit trail

All tables have **Row Level Security (RLS)** policies so users only see their own data.

## 🔐 Security

- All database operations use RLS policies
- Authentication via Supabase Auth
- Server Actions validate user session before any mutation
- File uploads restricted to authenticated users
- Service role key only used server-side

## 🌐 Deployment

Deploy to Vercel:

```bash
npm i -g vercel
vercel
```

Add environment variables in your Vercel project settings.

## 📧 Email Configuration

For email verification and password reset, configure your Supabase project's email settings:

1. Go to **Authentication → Email Templates**
2. Set the **Site URL** to your production URL
3. Configure SMTP or use Supabase's built-in email service

---

Built with ❤️ using Next.js and Supabase
