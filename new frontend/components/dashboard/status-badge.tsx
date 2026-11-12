import { cn } from '@/lib/utils'
import type { DeliveryStatus, HealthStatus, WebhookStatus } from '@/lib/dummy-data'

type Tone = 'success' | 'warning' | 'danger' | 'neutral' | 'info'

const toneStyles: Record<Tone, string> = {
  success: 'bg-success/10 text-success ring-success/20',
  warning: 'bg-warning/10 text-warning ring-warning/20',
  danger: 'bg-destructive/10 text-destructive ring-destructive/20',
  neutral: 'bg-muted text-muted-foreground ring-border',
  info: 'bg-sky-400/10 text-sky-300 ring-sky-400/20',
}

const dotStyles: Record<Tone, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-destructive',
  neutral: 'bg-muted-foreground',
  info: 'bg-sky-300',
}

export function Badge({
  tone,
  children,
  className,
}: {
  tone: Tone
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset capitalize',
        toneStyles[tone],
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', dotStyles[tone])} aria-hidden="true" />
      {children}
    </span>
  )
}

const healthTone: Record<HealthStatus, Tone> = {
  healthy: 'success',
  degraded: 'warning',
  failing: 'danger',
}

const deliveryTone: Record<DeliveryStatus, Tone> = {
  success: 'success',
  failed: 'danger',
  retrying: 'warning',
  pending: 'info',
}

export function HealthBadge({ health }: { health: HealthStatus }) {
  return <Badge tone={healthTone[health]}>{health}</Badge>
}

export function DeliveryBadge({ status }: { status: DeliveryStatus }) {
  return <Badge tone={deliveryTone[status]}>{status}</Badge>
}

export function WebhookStatusBadge({ status }: { status: WebhookStatus }) {
  return <Badge tone={status === 'active' ? 'success' : 'neutral'}>{status}</Badge>
}
