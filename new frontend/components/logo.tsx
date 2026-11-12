import Link from 'next/link'
import { Webhook } from 'lucide-react'

export function Logo({ href = '/dashboard' }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-semibold tracking-tight">
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Webhook className="size-4" aria-hidden="true" />
      </span>
      <span>Hookline</span>
    </Link>
  )
}
