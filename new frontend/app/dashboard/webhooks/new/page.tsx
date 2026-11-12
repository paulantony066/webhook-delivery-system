import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/page-header'
import { RegisterWebhookForm } from '@/components/dashboard/register-webhook-form'

export default function NewWebhookPage() {
  return (
    <>
      <Link
        href="/dashboard/webhooks"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Webhooks
      </Link>
      <PageHeader
        title="Register webhook"
        description="Subscribe a new endpoint to events from your workspace."
      />
      <RegisterWebhookForm />
    </>
  )
}
