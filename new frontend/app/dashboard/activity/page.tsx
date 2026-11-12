"use client"

import { useEffect, useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/dashboard/page-header"
import { ActivityLog } from "@/components/dashboard/activity-log"
import { useAuth } from '@/components/context/auth-context'

export default function ActivityPage() {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, isLoading } = useAuth()


  useEffect(() => {
  if (isLoading) return

  if (!user?.id) {
    setLoading(false)
    return
  }

  const fetchActivity = async () => {
    try {
      const response = await fetch("http://localhost:4000/getactivity", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch activity")
      }

      const data = await response.json()
      setDeliveries(data.deliveries || [])

    } catch (error) {
      console.error("Error fetching activity:", error)
    } finally {
      setLoading(false)
    }
  }

  fetchActivity()
}, [user?.id, isLoading])

  return (
    <>
      <PageHeader
        title="Activity"
        description="Every delivery attempt across your endpoints. Expand a row to inspect the payload and response."
        actions={
          <Button variant="outline">
            <Download aria-hidden="true" />
            Export CSV
          </Button>
        }
      />

      <ActivityLog
        deliveries={deliveries}
        loading={loading}
      />
    </>
  )
}