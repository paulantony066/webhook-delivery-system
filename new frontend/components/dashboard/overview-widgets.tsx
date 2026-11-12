import Link from 'next/link'
import { ArrowDownRight, ArrowRight, ArrowUpRight, Minus } from 'lucide-react'
import { Panel } from '@/components/dashboard/page-header'
import { DeliveryBadge, HealthBadge } from '@/components/dashboard/status-badge'
import { deliveries, getWebhookName, hourlyVolume, overviewStats, webhooks } from '@/lib/dummy-data'
import { cn } from '@/lib/utils'

export function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {overviewStats.map((stat) => {
        const Icon = stat.trend === 'up' ? ArrowUpRight : stat.trend === 'down' ? ArrowDownRight : Minus
        return (
          <div key={stat.label} className="flex flex-col gap-3 rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <div className="flex items-end justify-between gap-2">
              <p className="font-mono text-2xl font-semibold tracking-tight">{stat.value}</p>
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 text-xs font-medium',
                  stat.trend === 'up' && 'text-success',
                  stat.trend === 'down' && 'text-destructive',
                  stat.trend === 'neutral' && 'text-muted-foreground',
                )}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {stat.delta}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function DeliveryVolumeChart() {
  const max = Math.max(...hourlyVolume.map((h) => h.success + h.failed))

  return (
    <Panel
      title="Delivery volume"
      description="Successful vs. failed deliveries, last 24 hours"
      action={
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-chart-1" aria-hidden="true" />
            Success
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-chart-2" aria-hidden="true" />
            Failed
          </span>
        </div>
      }
    >
      <div className="p-5">
        <div
          className="flex h-56 items-end gap-1"
          role="img"
          aria-label="Bar chart of hourly webhook deliveries over the last 24 hours"
        >
          {hourlyVolume.map((h) => {
            const total = h.success + h.failed
            return (
              <div
                key={h.hour}
                className="group relative flex h-full flex-1 flex-col justify-end"
                title={`${h.hour} — ${h.success} success, ${h.failed} failed`}
              >
                <div className="flex flex-col overflow-hidden rounded-sm" style={{ height: `${(total / max) * 100}%` }}>
                  <div className="bg-chart-2" style={{ height: `${(h.failed / total) * 100}%`, minHeight: 2 }} />
                  <div className="flex-1 bg-chart-1/80 transition-colors group-hover:bg-chart-1" />
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
          <span>{hourlyVolume[0].hour}</span>
          <span>{hourlyVolume[8].hour}</span>
          <span>{hourlyVolume[16].hour}</span>
          <span>now</span>
        </div>
      </div>
    </Panel>
  )
}

export function EndpointHealthSummary() {
  return (
    <Panel
      title="Endpoint health"
      action={
        <Link href="/dashboard/health" className="text-xs text-muted-foreground hover:text-foreground">
          View all
        </Link>
      }
    >
      <ul className="divide-y">
        {webhooks.map((wh) => (
          <li key={wh.id}>
            <Link
              href={`/dashboard/webhooks/${wh.id}`}
              className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-accent/40"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{wh.name}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {wh.successRate}% · {wh.avgLatencyMs}ms
                </p>
              </div>
              {wh.status === 'disabled' ? (
                <span className="text-xs text-muted-foreground">Disabled</span>
              ) : (
                <HealthBadge health={wh.health} />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

export function RecentDeliveries() {
  return (
    <Panel
      title="Recent deliveries"
      action={
        <Link
          href="/dashboard/activity"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          All activity
          <ArrowRight className="size-3" aria-hidden="true" />
        </Link>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th scope="col" className="px-5 py-2.5 font-medium">Event</th>
              <th scope="col" className="px-5 py-2.5 font-medium">Endpoint</th>
              <th scope="col" className="px-5 py-2.5 font-medium">Status</th>
              <th scope="col" className="px-5 py-2.5 text-right font-medium">Code</th>
              <th scope="col" className="px-5 py-2.5 text-right font-medium">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {deliveries.slice(0, 7).map((d) => (
              <tr key={d.id} className="hover:bg-accent/30">
                <td className="whitespace-nowrap px-5 py-3 font-mono text-xs">{d.event}</td>
                <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">{getWebhookName(d.webhookId)}</td>
                <td className="px-5 py-3">
                  <DeliveryBadge status={d.status} />
                </td>
                <td className="px-5 py-3 text-right font-mono text-xs">{d.statusCode ?? '—'}</td>
                <td className="whitespace-nowrap px-5 py-3 text-right font-mono text-xs text-muted-foreground">
                  {d.timestamp.slice(11)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
