import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, AlertTriangle } from 'lucide-react'
import { formatDate, isOverdue, isDueSoon } from '@/lib/utils'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export async function UpcomingDeadlines() {
  const supabase = await createClient()
  const { data: tasks } = await supabase
    .from('tasks')
    .select('id, title, due_date, status, project_id, project:projects(name, color)')
    .not('due_date', 'is', null)
    .neq('status', 'completed')
    .eq('is_archived', false)
    .order('due_date', { ascending: true })
    .limit(8)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="w-4 h-4" />Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!tasks?.length ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const overdue = isOverdue(task.due_date)
              const soon = isDueSoon(task.due_date)
              return (
                <div key={task.id} className={cn(
                  'flex items-start gap-3 p-3 rounded-xl border transition-all hover:shadow-sm',
                  overdue ? 'border-red-500/30 bg-red-500/5' : soon ? 'border-amber-500/30 bg-amber-500/5' : 'border-border bg-card'
                )}>
                  {overdue && <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: (task.project as any)?.color }} />
                      <p className="text-xs text-muted-foreground truncate">{(task.project as any)?.name}</p>
                    </div>
                    <p className={cn('text-xs mt-1 font-medium', overdue ? 'text-red-400' : soon ? 'text-amber-400' : 'text-muted-foreground')}>
                      {overdue ? 'Overdue · ' : ''}{formatDate(task.due_date)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
