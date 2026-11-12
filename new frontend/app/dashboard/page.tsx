import Link from 'next/link'
import { Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { PageHeader } from '@/components/dashboard/page-header'
import {
  DeliveryVolumeChart,
  EndpointHealthSummary,
  RecentDeliveries,
  StatCards,
} from '@/components/dashboard/overview-widgets'

export default function OverviewPage() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="Delivery performance across all registered endpoints."
        actions={
          <Link href="/dashboard/webhooks/new" className={buttonVariants()}>
            <Plus aria-hidden="true" />
            Register webhook
          </Link>
        }
      />
      <StatCards />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DeliveryVolumeChart />
        </div>
        <EndpointHealthSummary />
      </div>
      <RecentDeliveries />
    </>
  )
}
