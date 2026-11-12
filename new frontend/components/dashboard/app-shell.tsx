'use client'

import { useAuth } from './../context/auth-context'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Activity,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Webhook,
  X,
} from 'lucide-react'
import { Logo } from '@/components/logo'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/webhooks', label: 'Webhooks', icon: Webhook },
  { href: '/dashboard/activity', label: 'Activity', icon: Activity },
  { href: '/dashboard/health', label: 'Health', icon: HeartPulse },
]

function isActive(pathname: string, href: string) {
  return href === '/dashboard' ? pathname === href : pathname.startsWith(href)
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { user, isLoading } = useAuth()

  // Generate initials dynamically from user's name if available
  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="px-2 pt-1">
        <Logo />
      </div>

      <div className="rounded-lg border bg-card px-3 py-2">
        <p className="text-xs text-muted-foreground">Workspace</p>
        <p className="truncate text-sm font-medium">Personal Workspace</p>
      </div>

      <nav aria-label="Main" className="flex flex-col gap-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-sidebar-accent font-medium text-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground',
              )}
            >
              <Icon className={cn('size-4', active && 'text-primary')} aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </nav>

      <Link
        href="/dashboard/webhooks/new"
        onClick={onNavigate}
        className={cn(buttonVariants({ size: 'lg' }), 'w-full')}
      >
        <Plus aria-hidden="true" />
        Register webhook
      </Link>

      <div className="mt-auto flex items-center gap-3 rounded-lg border bg-card p-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium">
          {isLoading ? '...' : getInitials(user?.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {isLoading ? 'Loading...' : user?.id || 'User'}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {isLoading ? '...' : user?.email || ''}
          </p>
        </div>
        <Link
          href="/login"
          className={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}
          aria-label="Sign out"
        >
          <LogOut aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r bg-sidebar lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            type="button"
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full w-72 border-r bg-sidebar">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'absolute right-3 top-4')}
              aria-label="Close navigation"
            >
              <X aria-hidden="true" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'lg:hidden')}
            aria-label="Open navigation"
          >
            <Menu aria-hidden="true" />
          </button>
          <div className="relative w-full max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <label htmlFor="global-search" className="sr-only">
              Search
            </label>
            <input
              id="global-search"
              type="search"
              placeholder="Search endpoints, events, delivery IDs…"
              className="h-9 w-full rounded-lg border border-input bg-input/20 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          </div>
          <div className="ml-auto hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <span className="size-2 rounded-full bg-success" aria-hidden="true" />
            All systems operational
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>
  )
}