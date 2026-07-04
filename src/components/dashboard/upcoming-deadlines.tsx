'use client'

import { Calendar, MoreHorizontal } from 'lucide-react'

const DEADLINES = [
  { day: 'Today', items: [{ title: 'Website Review', color: 'bg-red-400' }, { title: 'Q3 Report Draft', color: 'bg-amber-400' }] },
  { day: 'Tomorrow', items: [{ title: 'Client Feedback', color: 'bg-blue-400' }] },
  { day: 'Friday', items: [{ title: 'Final Submission', color: 'bg-[#5ed29c]' }, { title: 'Team Sync', color: 'bg-purple-400' }] },
]

export function UpcomingDeadlines() {
  return (
    <div className="rounded-[20px] bg-card border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[15px] font-semibold text-foreground">Upcoming Deadlines</h3>
        <button className="w-8 h-8 flex items-center justify-center rounded-[10px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-6">
        {DEADLINES.map((group) => (
          <div key={group.day}>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {group.day}
            </div>
            <div className="space-y-3 relative before:absolute before:inset-y-1 before:left-1.5 before:w-px before:bg-border">
              {group.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3 relative">
                  {/* Dot */}
                  <div className="relative mt-1">
                    <div className="w-3 h-3 rounded-full border-[3px] border-card z-10 relative" />
                    <div className={`absolute inset-0 rounded-full ${item.color}`} />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0 bg-muted/30 rounded-[12px] px-3 py-2 border border-border/50">
                    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
