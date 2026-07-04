'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, Moon, Sun, Plus } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getInitials } from '@/lib/utils'
import { globalSearch } from '@/actions/user'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
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

  // Real-time notification count
  useEffect(() => {
    const supabase = createClient()
    async function loadCount() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false)
      setUnreadCount(count ?? 0)
    }
    loadCount()

    const channel = supabase
      .channel('notifications')
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
    <header className="relative z-50 h-16 border-b border-border bg-background/90 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 flex-shrink-0 gap-3">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          id="global-search"
          type="search"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="w-full h-9 bg-muted/50 border border-transparent rounded-full pl-9 pr-4 text-sm focus:outline-none focus:bg-background focus:border-ring focus:ring-4 focus:ring-ring/10 transition-all duration-200 placeholder:text-muted-foreground"
        />
        {showResults && results && (
          <div className="absolute top-full left-0 right-[-40px] sm:right-auto sm:w-[400px] mt-2 bg-card border border-border rounded-xl shadow-xl z-50 max-h-[60vh] overflow-y-auto animate-in fade-in slide-in-from-top-2">
            {results.projects.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30">Projects</div>
                {results.projects.map((p) => (
                  <Link key={p.id} href={`/projects/${p.id}`} className="flex items-center gap-3 px-3 py-2 hover:bg-accent text-sm transition-colors">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: p.color }} />
                    {p.name}
                  </Link>
                ))}
              </div>
            )}
            {results.tasks.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30">Tasks</div>
                {results.tasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 px-3 py-2 hover:bg-accent text-sm cursor-pointer transition-colors">
                    <span className="text-muted-foreground">📋</span>{t.title}
                  </div>
                ))}
              </div>
            )}
            {results.users.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30">People</div>
                {results.users.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 px-3 py-2 hover:bg-accent text-sm cursor-pointer transition-colors">
                    <Avatar className="w-6 h-6"><AvatarFallback className="text-xs">{getInitials(u.full_name)}</AvatarFallback></Avatar>
                    {u.full_name ?? u.email}
                  </div>
                ))}
              </div>
            )}
            {!results.projects.length && !results.tasks.length && !results.users.length && (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">No results found</div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon-sm"
          id="theme-toggle"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <Link href="/notifications">
          <Button variant="ghost" size="icon-sm" id="notification-bell" className="relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </Link>

        {/* Profile */}
        <Link href="/profile">
          <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all duration-200">
            <AvatarImage src={profile?.avatar_url ?? ''} alt={profile?.full_name ?? ''} />
            <AvatarFallback className="text-xs">{getInitials(profile?.full_name)}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  )
}
