
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog'
import { ToggleSwitch } from '@/components/dashboard/toggle-switch'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/context/auth-context'

interface Webhook {
  id: string
  targetUrl: string
  eventType: string
  description: string | null
  isActive: boolean
  createdAt: string
}

const filters = ['all', 'active', 'disabled'] as const
type Filter = (typeof filters)[number]

export function WebhooksTable() {
  const [items, setItems] = useState<Webhook[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [pendingRemoval, setPendingRemoval] = useState<Webhook | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { user, isLoading } = useAuth()

  
  useEffect(() => {
    if (isLoading) return

    if (!user?.id) {
      setError('Please log in to view your webhooks.')
      setLoading(false)
      return
    }

    const fetchWebhooks = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          'http://localhost:4000/subscribe/get_subscriptions',
           {
          method: "POST",
          credentials: "include",
          headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify({
          userId: user?.id,
          }),
          }
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch webhooks')
        }

        setItems(result.subscriptions || [])

      } catch (err) {
        console.error('Error fetching webhooks:', err)

        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchWebhooks()
  }, [user?.id, isLoading])

  const visible = items.filter((w) => {
    if (filter === 'all') return true
    if (filter === 'active') return w.isActive
    return !w.isActive
  })

const toggle = async (id: string, enabled: boolean) => {
  try {
    const response = await fetch(
      `http://localhost:4000/subscribe/enable_disable/${id}`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: enabled,
        }),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update webhook')
    }

    setItems((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isActive: enabled } : w
      )
    )

  } catch (error) {
    console.error('Error updating webhook:', error)
    alert(error instanceof Error ? error.message : 'Failed to update webhook')
  }
}

  // Currently removes from frontend state only
  const unsubscribe = () => {
    if (!pendingRemoval) return

    setItems((prev) =>
      prev.filter((w) => w.id !== pendingRemoval.id)
    )

    setPendingRemoval(null)
  }

  return (
    <section className="rounded-xl border bg-card">

      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">

        <div
          role="tablist"
          aria-label="Filter webhooks"
          className="flex gap-1 rounded-lg bg-muted p-1"
        >
          {filters.map((f) => {
            const count =
              f === 'all'
                ? items.length
                : items.filter((w) =>
                    f === 'active' ? w.isActive : !w.isActive
                  ).length

            return (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors',
                  filter === f
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {f}
                <span className="ml-1 text-muted-foreground">
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <p className="text-xs text-muted-foreground">
          Toggle to enable or pause deliveries
        </p>

      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="px-5 py-2.5 font-medium">Enabled</th>
              <th className="px-5 py-2.5 font-medium">Endpoint</th>
              <th className="px-5 py-2.5 font-medium">Event</th>
              <th className="px-5 py-2.5 font-medium">Description</th>
              <th className="px-5 py-2.5 font-medium">Created</th>
              <th className="px-5 py-2.5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">

            {loading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-sm text-muted-foreground"
                >
                  Loading webhooks...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-sm text-destructive"
                >
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && visible.map((wh) => (
              <tr
                key={wh.id}
                className={cn(
                  'hover:bg-accent/30',
                  !wh.isActive && 'opacity-60'
                )}
              >

                <td className="px-5 py-3">
                  <ToggleSwitch
                    checked={wh.isActive}
                    onChange={(v) => toggle(wh.id, v)}
                    label={`${wh.isActive ? 'Disable' : 'Enable'} webhook`}
                  />
                </td>

                <td className="max-w-xs px-5 py-3">
                  <Link
                    href={`/dashboard/webhooks/${wh.id}`}
                    className="font-medium hover:underline"
                  >
                    {wh.description || 'Webhook endpoint'}
                  </Link>

                  <p className="truncate font-mono text-xs text-muted-foreground">
                    {wh.targetUrl}
                  </p>
                </td>

                <td className="px-5 py-3">
                  <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                    {wh.eventType}
                  </span>
                </td>

                <td className="max-w-xs px-5 py-3 text-xs text-muted-foreground">
                  {wh.description || '—'}
                </td>

                <td className="whitespace-nowrap px-5 py-3 text-xs text-muted-foreground">
                  {new Date(wh.createdAt).toLocaleDateString()}
                </td>

                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">

                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Unsubscribe webhook"
                      onClick={() => setPendingRemoval(wh)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>

                    <Link
                      href={`/dashboard/webhooks/${wh.id}`}
                      aria-label="View webhook"
                      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <ChevronRight
                        className="size-4"
                        aria-hidden="true"
                      />
                    </Link>

                  </div>
                </td>

              </tr>
            ))}

            {!loading && !error && visible.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-sm text-muted-foreground"
                >
                  No webhooks match this filter.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={pendingRemoval !== null}
        title="Unsubscribe webhook?"
        description={
          <>
            <span className="font-medium text-foreground">
              {pendingRemoval?.targetUrl}
            </span>
            {' will stop receiving events. Pending retries will be discarded.'}
          </>
        }
        confirmLabel="Unsubscribe"
        onConfirm={unsubscribe}
        onCancel={() => setPendingRemoval(null)}
      />

    </section>
  )
}
