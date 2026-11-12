'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, RotateCw, Send, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog'
import { Panel } from '@/components/dashboard/page-header'
import { DeliveryBadge, HealthBadge, WebhookStatusBadge } from '@/components/dashboard/status-badge'
import { ToggleSwitch } from '@/components/dashboard/toggle-switch'
import { deliveries, type Webhook } from '@/lib/dummy-data'

export function WebhookDetail({ webhook }: { webhook: Webhook }) {
  const router = useRouter()
  const [enabled, setEnabled] = useState(webhook.status === 'active')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const recent = deliveries.filter((d) => d.webhookId === webhook.id)

  const stats = [
    { label: 'Success rate', value: `${webhook.successRate}%` },
    { label: 'Avg. latency', value: `${webhook.avgLatencyMs} ms` },
    { label: 'Deliveries (24h)', value: webhook.deliveries24h.toLocaleString('en-US') },
    { label: 'Last delivery', value: webhook.lastDelivery },
  ]

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{webhook.name}</h1>
            <WebhookStatusBadge status={enabled ? 'active' : 'disabled'} />
            <HealthBadge health={webhook.health} />
          </div>
          <p className="truncate font-mono text-sm text-muted-foreground">{webhook.url}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5">
            <span className="text-sm">{enabled ? 'Enabled' : 'Disabled'}</span>
            <ToggleSwitch checked={enabled} onChange={setEnabled} label="Enable webhook" />
          </div>
          <Button variant="outline">
            <Send aria-hidden="true" />
            Send test
          </Button>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            <Trash2 aria-hidden="true" />
            Unsubscribe
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-2 rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="font-mono text-xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Recent deliveries" className="xl:col-span-2">
          <ul className="divide-y">
            {recent.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <DeliveryBadge status={d.status} />
                  <span className="font-mono text-xs">{d.event}</span>
                </div>
                <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
                  <span>{d.statusCode ?? '—'}</span>
                  <span>{d.latencyMs != null ? `${d.latencyMs}ms` : '—'}</span>
                  <span>{d.timestamp.slice(11)}</span>
                </div>
              </li>
            ))}
            {recent.length === 0 && (
              <li className="px-5 py-10 text-center text-sm text-muted-foreground">No deliveries in the last 24 hours.</li>
            )}
          </ul>
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel title="Subscribed events">
            <div className="flex flex-wrap gap-1.5 p-5">
              {webhook.events.map((e) => (
                <span key={e} className="rounded bg-muted px-2 py-1 font-mono text-xs">
                  {e}
                </span>
              ))}
            </div>
          </Panel>
          <Panel title="Configuration">
            <dl className="flex flex-col divide-y text-sm">
              <div className="flex justify-between gap-4 px-5 py-3">
                <dt className="text-muted-foreground">Webhook ID</dt>
                <dd className="font-mono text-xs">{webhook.id}</dd>
              </div>
              <div className="flex justify-between gap-4 px-5 py-3">
                <dt className="text-muted-foreground">Created</dt>
                <dd>{webhook.createdAt}</dd>
              </div>
              <div className="flex justify-between gap-4 px-5 py-3">
                <dt className="text-muted-foreground">Retry policy</dt>
                <dd>5 attempts</dd>
              </div>
              <div className="flex flex-col gap-2 px-5 py-3">
                <dt className="text-muted-foreground">Signing secret</dt>
                <dd className="flex items-center gap-2">
                  <code className="flex-1 truncate rounded bg-muted px-2 py-1 font-mono text-xs">{webhook.secret}</code>
                  <Button variant="ghost" size="icon-sm" aria-label="Copy secret">
                    <Copy aria-hidden="true" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" aria-label="Rotate secret">
                    <RotateCw aria-hidden="true" />
                  </Button>
                </dd>
              </div>
            </dl>
          </Panel>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Unsubscribe webhook?"
        description={
          <>
            <span className="font-medium text-foreground">{webhook.name}</span>
            {' will stop receiving all events immediately.'}
          </>
        }
        confirmLabel="Unsubscribe"
        onConfirm={() => router.push('/dashboard/webhooks')}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
