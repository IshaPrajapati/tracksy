'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, Moon, Sun, Zap, Command } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { globalSearch } from '@/actions/user'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Profile } from '@/types'

interface TopbarProps {
  profile: Profile | null
}

export function Topbar({ profile }: TopbarProps) {
  const { theme, setTheme } = useTheme()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Awaited<ReturnType<typeof globalSearch>> | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    async function loadCount() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { count } = await supabase
        .from('notifications').select('*', { count: 'exact', head: true })
        .eq('user_id', user.id).eq('is_read', false)
      setUnreadCount(count ?? 0)
    }
    loadCount()
    const channel = supabase.channel('notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => loadCount())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const handleSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults(null); return }
    const data = await globalSearch(q)
    setResults(data)
    setShowResults(true)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => handleSearch(query), 300)
    return () => clearTimeout(t)
  }, [query, handleSearch])

  return (
    <header className="relative z-50 h-[72px] border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 flex-shrink-0 gap-6 transition-colors duration-300">
      {/* Left: Search */}
      <div className="relative flex-1 max-w-[480px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          id="global-search"
          type="search"
          placeholder="Search projects, tasks, or people..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="w-full h-10 bg-card border border-border rounded-[16px] pl-10 pr-12 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-200 shadow-sm"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center gap-1 h-5 px-1.5 bg-muted rounded-[6px] text-[10px] text-muted-foreground font-mono font-medium border border-border">
          <Command className="w-3 h-3" />K
        </kbd>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showResults && results && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute top-[calc(100%+8px)] left-0 right-0 bg-card border border-border rounded-[16px] shadow-lg z-50 max-h-[50vh] overflow-y-auto"
            >
              {results.projects.length > 0 && (
                <div>
                  <div className="px-4 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/30">Projects</div>
                  {results.projects.map((p) => (
                    <Link key={p.id} href={`/projects/${p.id}/board`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted text-sm text-foreground transition-colors">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
                      {p.name}
                    </Link>
                  ))}
                </div>
              )}
              {results.tasks.length > 0 && (
                <div>
                  <div className="px-4 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/30">Tasks</div>
                  {results.tasks.map((t) => (
                    <Link key={t.id} href={`/projects/${t.project_id}/board`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted text-sm text-foreground cursor-pointer transition-colors">
                      <span className="text-muted-foreground text-xs">✓</span>{t.title}
                    </Link>
                  ))}
                </div>
              )}
              {results.users.length > 0 && (
                <div>
                  <div className="px-4 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/30">People</div>
                  {results.users.map((u) => (
                    <div key={u.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted text-sm text-foreground cursor-pointer transition-colors">
                      <Avatar className="w-5 h-5"><AvatarFallback className="text-[9px] bg-primary/10 text-primary">{getInitials(u.full_name)}</AvatarFallback></Avatar>
                      {u.full_name ?? u.email}
                    </div>
                  ))}
                </div>
              )}
              {!results.projects.length && !results.tasks.length && !results.users.length && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">No results found</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-9 h-9 flex items-center justify-center rounded-[12px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
        </button>

        {/* Notifications */}
        <Link href="/notifications">
          <button className="w-9 h-9 flex items-center justify-center rounded-[12px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200 relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
            )}
          </button>
        </Link>

        {/* Profile */}
        <Link href="/profile" className="ml-2">
          <Avatar className="w-8 h-8 cursor-pointer ring-1 ring-border hover:ring-primary/50 transition-all duration-200">
            <AvatarImage src={profile?.avatar_url ?? ''} alt={profile?.full_name ?? ''} />
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-medium">{getInitials(profile?.full_name)}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  )
}
