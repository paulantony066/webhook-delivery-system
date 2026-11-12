import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { WebhookDetail } from '@/components/dashboard/webhook-detail'
import { getWebhook } from '@/lib/dummy-data'

export default async function WebhookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const webhook = getWebhook(id)
  if (!webhook) notFound()

  return (
    <>
      <Link
        href="/dashboard/webhooks"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        webhooks
      </Link>
      <WebhookDetail webhook={webhook} />
    </>
  )
}
