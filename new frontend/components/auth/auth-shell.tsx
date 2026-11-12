import { CheckCircle2 } from 'lucide-react'
import { Logo } from '@/components/logo'

const highlights = [
  'Signed payloads with automatic retries and exponential backoff',
  'Real-time delivery logs with request and response inspection',
  'Per-endpoint health scoring and failure alerts',
]

const feed = [
  { event: 'order.created', code: 200, ms: 74 },
  { event: 'payment.succeeded', code: 200, ms: 91 },
  { event: 'customer.created', code: 503, ms: 5000 },
  { event: 'invoice.paid', code: 200, ms: 312 },
]

export function AuthShell({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-10">
        <Logo href="/login" />
        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8 py-12">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </main>
        <p className="text-xs text-muted-foreground">
          {'© 2026 Hookline, Inc. All rights reserved.'}
        </p>
      </div>

      <aside className="relative hidden flex-col justify-between overflow-hidden border-l bg-sidebar p-10 lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(var(--foreground)_1px,transparent_1px),linear-gradient(90deg,var(--foreground)_1px,transparent_1px)] [background-size:32px_32px]"
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-6">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">
            Webhook delivery infrastructure
          </p>
          <h2 className="max-w-md text-balance text-3xl font-semibold leading-tight tracking-tight">
            Every event delivered. Every failure visible.
          </h2>
          <ul className="flex flex-col gap-3">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative rounded-xl border bg-card/80 p-4 font-mono text-xs backdrop-blur">
          <div className="mb-3 flex items-center justify-between text-muted-foreground">
            <span>live deliveries</span>
            <span className="flex items-center gap-1.5 text-primary">
              <span className="size-1.5 animate-pulse rounded-full bg-primary" aria-hidden="true" />
              streaming
            </span>
          </div>
          <ul className="flex flex-col gap-2">
            {feed.map((row) => (
              <li key={row.event} className="flex items-center justify-between gap-4">
                <span className="text-foreground">{row.event}</span>
                <span className="flex items-center gap-4">
                  <span className={row.code < 300 ? 'text-success' : 'text-destructive'}>
                    {row.code}
                  </span>
                  <span className="w-14 text-right text-muted-foreground">{row.ms}ms</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
