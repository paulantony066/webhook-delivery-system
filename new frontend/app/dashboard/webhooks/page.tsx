import Link from 'next/link'
import { Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { PageHeader } from '@/components/dashboard/page-header'
import { WebhooksTable } from '@/components/dashboard/webhooks-table'

export default function WebhooksPage() {
  return (
    <>
      <PageHeader
        title="Webhooks"
        description="Manage subscribed endpoints, the events they receive, and their delivery state."
        actions={
          <Link href="/dashboard/webhooks/new" className={buttonVariants()}>
            <Plus aria-hidden="true" />
            Register webhook
          </Link>
        }
      />
      <WebhooksTable />
    </>
  )
}
