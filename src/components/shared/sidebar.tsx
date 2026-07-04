'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { signOut } from '@/actions/auth'
import {
  LayoutDashboard, FolderKanban, Bell, User, LogOut,
  ChevronLeft, ChevronRight, Settings, Users, Plus, Zap
} from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Profile } from '@/types'

const NAV_SECTIONS = [
  {
    label: 'Workspace',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/projects', icon: FolderKanban, label: 'Projects' },
    ]
  },
  {
    label: 'Team',
    items: [
      { href: '/notifications', icon: Bell, label: 'Notifications' },
      { href: '/profile', icon: User, label: 'Profile' },
    ]
  }
]

interface SidebarProps {
  profile: Profile | null
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex flex-col h-full border-r border-border bg-sidebar transition-all duration-300 ease-in-out relative z-20 flex-shrink-0',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-3 border-b border-border flex-shrink-0', collapsed ? 'p-4 justify-center h-[72px]' : 'px-6 py-4 h-[72px]')}>
        <div className="w-8 h-8 rounded-[10px] bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 fill-current" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }} className="overflow-hidden">
              <span className="text-foreground font-bold tracking-tight text-[15px] whitespace-nowrap">Tracksy</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Create */}
      <div className="p-4 flex-shrink-0">
        <button className={cn(
          "flex items-center justify-center gap-2 bg-foreground text-background font-medium text-sm rounded-full hover:bg-foreground/90 transition-all group",
          collapsed ? "w-10 h-10 mx-auto p-0" : "w-full py-2.5 px-4"
        )}>
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          {!collapsed && <span>New Project</span>}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-6 overflow-y-auto mt-2">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed && <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-2">{section.label}</div>}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-[12px] text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-secondary-foreground/70 hover:text-foreground hover:bg-muted',
                      collapsed ? 'justify-center p-2.5 mx-1' : 'px-3 py-2.5'
                    )}
                  >
                    <item.icon className={cn('w-[18px] h-[18px] flex-shrink-0 transition-colors')} />
                    {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-border space-y-1 bg-sidebar">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'flex items-center gap-3 rounded-[12px] text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted',
            collapsed ? 'justify-center p-2.5 mx-1' : 'px-3 py-2.5 w-full'
          )}
        >
          {collapsed ? <ChevronRight className="w-[18px] h-[18px] flex-shrink-0" /> : <><ChevronLeft className="w-[18px] h-[18px] flex-shrink-0" /><span>Collapse</span></>}
        </button>

        <form action={signOut}>
          <button type="submit" className={cn(
            'flex items-center gap-3 rounded-[12px] text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-destructive hover:bg-destructive/10',
            collapsed ? 'justify-center p-2.5 mx-1' : 'px-3 py-2.5 w-full'
          )}>
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </form>
      </div>
    </aside>
  )
}
