import Link from 'next/link'
import { PageHeader } from '@/components/dashboard/page-header'
import { HealthBadge } from '@/components/dashboard/status-badge'
import { webhooks, type HealthStatus } from '@/lib/dummy-data'
import { cn } from '@/lib/utils'

const failureChance: Record<HealthStatus, number> = { healthy: 0.03, degraded: 0.18, failing: 0.45 }

function uptimeBars(seed: string, health: HealthStatus) {
  let x = [...seed].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return Array.from({ length: 48 }, () => {
    x = (x * 9301 + 49297) % 233280
    const r = x / 233280
    if (r < failureChance[health] / 2) return 'down'
    if (r < failureChance[health]) return 'partial'
    return 'up'
  })
}

const summary = [
  { label: 'Healthy', value: webhooks.filter((w) => w.health === 'healthy').length, className: 'text-success' },
  { label: 'Degraded', value: webhooks.filter((w) => w.health === 'degraded').length, className: 'text-warning' },
  { label: 'Failing', value: webhooks.filter((w) => w.health === 'failing').length, className: 'text-destructive' },
]

export default function HealthPage() {
  return (
    <>
      <PageHeader
        title="Health"
        description="Endpoint availability, latency, and error rates over the last 48 hours."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {summary.map((s) => (
          <div key={s.label} className="flex items-center justify-between rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={cn('font-mono text-2xl font-semibold', s.className)}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {webhooks.map((wh) => {
          const bars = uptimeBars(wh.id, wh.health)
          const p95 = Math.round(wh.avgLatencyMs * 2.3)
          return (
            <Link
              key={wh.id}
              href={`/dashboard/webhooks/${wh.id}`}
              className="flex flex-col gap-4 rounded-xl border bg-card p-5 transition-colors hover:border-ring/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{wh.name}</p>
                  <p className="truncate font-mono text-xs text-muted-foreground">{wh.url}</p>
                </div>
                {wh.status === 'disabled' ? (
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">Disabled</span>
                ) : (
                  <HealthBadge health={wh.health} />
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex h-8 gap-0.5" role="img" aria-label={`Hourly availability for ${wh.name}`}>
                  {bars.map((b, i) => (
                    <span
                      key={i}
                      className={cn(
                        'flex-1 rounded-[2px]',
                        b === 'up' && 'bg-success/70',
                        b === 'partial' && 'bg-warning/80',
                        b === 'down' && 'bg-destructive/80',
                      )}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>48h ago</span>
                  <span>now</span>
                </div>
              </div>

              <dl className="grid grid-cols-4 gap-3 border-t pt-4">
                {[
                  { label: 'Success', value: `${wh.successRate}%` },
                  { label: 'p50', value: `${wh.avgLatencyMs}ms` },
                  { label: 'p95', value: `${p95}ms` },
                  { label: 'Errors', value: `${(100 - wh.successRate).toFixed(1)}%` },
                ].map((m) => (
                  <div key={m.label} className="flex flex-col gap-0.5">
                    <dt className="text-xs text-muted-foreground">{m.label}</dt>
                    <dd className="font-mono text-sm">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </Link>
          )
        })}
      </div>
    </>
  )
}
