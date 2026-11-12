
'use client'

import { Fragment, useState } from 'react'
import { ChevronDown, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { inputClass } from '@/components/form-field'
import { DeliveryBadge } from '@/components/dashboard/status-badge'
import { samplePayload, sampleResponse, type DeliveryStatus } from '@/lib/dummy-data'
import { cn } from '@/lib/utils'

interface Delivery {
  delivery_id: string
  status: 'success' | 'failed' | 'pending' | 'retrying'
  event: string
  endpoint: string
  code: number | null
  latency: number | null
  attempts: number
  timestamp: string
  last_attempt_at: string | null
}

interface ActivityLogProps {
  deliveries: Delivery[]
  loading: boolean
}

const statuses: Array<'all' | DeliveryStatus> = [
  'all',
  'success',
  'failed',
  'retrying',
  'pending',
]

export function ActivityLog({ deliveries, loading }: ActivityLogProps) {
  const [status, setStatus] = useState<'all' | DeliveryStatus>('all')
  const [endpoint, setEndpoint] = useState('all')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const rows = deliveries.filter(
    (d) =>
      (status === 'all' || d.status === status) &&
      (endpoint === 'all' || d.endpoint === endpoint) &&
      (
        query === '' ||
        d.event.toLowerCase().includes(query.toLowerCase()) ||
        d.delivery_id.toLowerCase().includes(query.toLowerCase())
      ),
  )

  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">
        Loading activity...
      </div>
    )
  }

  return (
    <section className="rounded-xl border bg-card">
      <div className="flex flex-col gap-3 border-b px-5 py-4 lg:flex-row lg:items-center">
        <div role="tablist" aria-label="Filter by status" className="flex flex-wrap gap-1 rounded-lg bg-muted p-1">
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={status === s}
              onClick={() => setStatus(s)}
              className={cn(
                'rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors',
                status === s
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-3 sm:flex-row lg:justify-end">
          <label htmlFor="activity-search" className="sr-only">
            Search by event or delivery ID
          </label>
          <input
            id="activity-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search event or delivery ID"
            className={cn(inputClass, 'sm:max-w-64')}
          />

          <label htmlFor="activity-endpoint" className="sr-only">
            Filter by endpoint
          </label>
          <select
            id="activity-endpoint"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className={cn(inputClass, 'sm:max-w-56')}
          >
            <option value="all">All endpoints</option>
            {[...new Set(deliveries.map((d) => d.endpoint))].map((url) => (
              <option key={url} value={url}>
                {url}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th scope="col" className="w-8 px-5 py-2.5">
                <span className="sr-only">Expand</span>
              </th>
              <th scope="col" className="px-3 py-2.5 font-medium">Status</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Event</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Endpoint</th>
              <th scope="col" className="px-3 py-2.5 text-right font-medium">Code</th>
              <th scope="col" className="px-3 py-2.5 text-right font-medium">Latency</th>
              <th scope="col" className="px-3 py-2.5 text-right font-medium">Attempts</th>
              <th scope="col" className="px-5 py-2.5 text-right font-medium">Timestamp</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {rows.map((d) => {
              const open = expanded === d.delivery_id

              return (
                <Fragment key={d.delivery_id}>
                  <tr className={cn('hover:bg-accent/30', open && 'bg-accent/30')}>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => setExpanded(open ? null : d.delivery_id)}
                        aria-expanded={open}
                        aria-label={`Toggle details for ${d.delivery_id}`}
                        className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <ChevronDown
                          className={cn('size-4 transition-transform', open && 'rotate-180')}
                          aria-hidden="true"
                        />
                      </button>
                    </td>

                    <td className="px-3 py-3">
                      <DeliveryBadge status={d.status} />
                    </td>

                    <td className="whitespace-nowrap px-3 py-3">
                      <p className="font-mono text-xs">{d.event}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {d.delivery_id}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                      {d.endpoint}
                    </td>

                    <td className={cn(
                      'px-3 py-3 text-right font-mono text-xs',
                      d.code != null && d.code >= 400 && 'text-destructive',
                    )}>
                      {d.code ?? '—'}
                    </td>

                    <td className="px-3 py-3 text-right font-mono text-xs">
                      {d.latency != null ? `${d.latency}ms` : '—'}
                    </td>

                    <td className="px-3 py-3 text-right font-mono text-xs">
                      {d.attempts}
                    </td>

                    <td className="whitespace-nowrap px-5 py-3 text-right font-mono text-xs text-muted-foreground">
                      {new Date(d.timestamp).toLocaleString()}
                    </td>
                  </tr>

                  {open && (
                    <tr className="bg-background/40">
                      <td colSpan={8} className="px-5 py-4">
                        <div className="grid gap-4 lg:grid-cols-2">
                          <div className="flex flex-col gap-2">
                            <p className="text-xs font-medium text-muted-foreground">
                              Request payload
                            </p>
                            <pre className="overflow-x-auto rounded-lg border bg-sidebar p-3 font-mono text-xs leading-relaxed">
                              {samplePayload.replace('order.created', d.event)}
                            </pre>
                          </div>

                          <div className="flex flex-col gap-2">
                            <p className="text-xs font-medium text-muted-foreground">
                              Response
                            </p>
                            <pre className="overflow-x-auto rounded-lg border bg-sidebar p-3 font-mono text-xs leading-relaxed">
                              {d.code != null
                                ? sampleResponse.replace('200 OK', `${d.code}`)
                                : 'Awaiting delivery…'}
                            </pre>

                            {(d.status === 'failed' || d.status === 'retrying') && (
                              <Button variant="outline" size="sm" className="w-fit">
                                <RotateCw aria-hidden="true" />
                                Retry now
                              </Button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-sm text-muted-foreground">
                  No deliveries match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t px-5 py-3 text-xs text-muted-foreground">
        <span>
          Showing {rows.length} of {deliveries.length} deliveries
        </span>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </section>
  )
}
