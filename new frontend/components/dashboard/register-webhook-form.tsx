
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { toast } from 'sonner'

import { Button, buttonVariants } from '@/components/ui/button'
import { FormField, inputClass } from '@/components/form-field'
import { Panel } from '@/components/dashboard/page-header'
import { ToggleSwitch } from '@/components/dashboard/toggle-switch'
import { availableEvents } from '@/lib/dummy-data'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/context/auth-context'

export function RegisterWebhookForm() {
  const router = useRouter()

  const [selected, setSelected] = useState<string[]>(['order.created'])
  const [enabled, setEnabled] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { user, isLoading } = useAuth()

  const toggleEvent = (event: string) => {
    setSelected((prev) =>
      prev.includes(event)
        ? prev.filter((e) => e !== event)
        : [...prev, event]
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isLoading || !user?.id) {
      toast.error('User not authenticated')
      return
    }

    const formData = new FormData(e.currentTarget)

    const targetUrl = (formData.get('url') as string)?.trim()
    const description = (formData.get('description') as string)?.trim()

    // Validate required fields
    if (!targetUrl || !description || selected.length === 0) {
      toast.error('Please fill all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('http://localhost:4000/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          targetUrl,
          eventType: selected,
        }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result.message || 'Webhook registration failed')
      }

      toast.success('Webhook registered successfully!')

      router.push('/dashboard/webhooks')

    } catch (error) {
      console.error('Webhook registration error:', error)

      toast.error(
        error instanceof Error
          ? error.message
          : 'Webhook registration failed'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className="grid gap-6 lg:grid-cols-3"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-6 lg:col-span-2">

        <Panel
          title="Endpoint"
          description="Where we will send signed POST requests."
        >
          <div className="flex flex-col gap-5 p-5">

            <FormField
              id="name"
              label="Name"
              placeholder="e.g. Order fulfillment service"
            />

            <FormField
              id="url"
              label="Endpoint URL"
              type="url"
              placeholder="https://api.example.com/webhooks"
              hint="Must be a publicly reachable HTTPS URL."
              className="[&_input]:font-mono"
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-medium">
                Description <span className="font-normal text-muted-foreground">(optional)</span>
              </label>

              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="What is this endpoint used for?"
                className={cn(inputClass, 'h-auto py-2')}
              />
            </div>

          </div>
        </Panel>

        <Panel
          title="Events"
          description={`${selected.length} of ${availableEvents.length} selected`}
        >
          <fieldset className="p-5">
            <legend className="sr-only">Events to subscribe to</legend>

            <div className="grid gap-2 sm:grid-cols-2">
              {availableEvents.map((event) => {
                const checked = selected.includes(event)

                return (
                  <label
                    key={event}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors',
                      checked
                        ? 'border-primary/50 bg-primary/5'
                        : 'hover:bg-accent/40'
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleEvent(event)}
                    />

                    <span
                      className={cn(
                        'flex size-4 items-center justify-center rounded border',
                        checked
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-input'
                      )}
                      aria-hidden="true"
                    >
                      {checked && <Check className="size-3" />}
                    </span>

                    <span className="font-mono text-xs">{event}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        </Panel>

      </div>

      <div className="flex flex-col gap-6">

        <Panel title="Delivery settings">
          <div className="flex flex-col gap-5 p-5">

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Enable on create</p>
                <p className="text-xs text-muted-foreground">
                  Start delivering immediately
                </p>
              </div>

              <ToggleSwitch
                checked={enabled}
                onChange={setEnabled}
                label="Enable on create"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="retries" className="text-sm font-medium">
                Retry policy
              </label>

              <select
                id="retries"
                name="retries"
                className={inputClass}
                defaultValue="5"
              >
                <option value="0">No retries</option>
                <option value="3">3 attempts, exponential backoff</option>
                <option value="5">5 attempts, exponential backoff</option>
                <option value="10">10 attempts, exponential backoff</option>
              </select>
            </div>

            <FormField
              id="timeout"
              label="Timeout (seconds)"
              type="number"
              defaultValue={10}
              min={1}
              max={30}
            />

          </div>
        </Panel>

        <Panel title="Signing secret">
          <div className="flex flex-col gap-2 p-5">
            <p className="text-xs text-muted-foreground">
              A secret will be generated after registration. Use it to verify the
              <span className="font-mono text-foreground">
                {' '}x-hookline-signature{' '}
              </span>
              header.
            </p>
          </div>
        </Panel>

        <div className="flex gap-2">

          <Link
            href="/dashboard/webhooks"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'flex-1'
            )}
          >
            Cancel
          </Link>

          <Button
            type="submit"
            size="lg"
            className="flex-1"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? 'Registering...' : 'Register webhook'}
          </Button>

        </div>

      </div>
    </form>
  )
}
