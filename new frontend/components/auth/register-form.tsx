'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/form-field'

export function RegisterForm() {
  const router = useRouter()

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault()
        router.push('/dashboard')
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="firstName" label="First name" placeholder="Ada" autoComplete="given-name" />
        <FormField id="lastName" label="Last name" placeholder="Okafor" autoComplete="family-name" />
      </div>
      <FormField id="company" label="Workspace name" placeholder="Acme Inc." autoComplete="organization" />
      <FormField id="email" label="Work email" type="email" placeholder="you@company.com" autoComplete="email" />
      <FormField
        id="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        hint="At least 8 characters with a number and a symbol."
      />
      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input type="checkbox" name="terms" className="mt-0.5 size-4 accent-primary" />
        <span>
          {'I agree to the '}
          <Link href="#" className="text-foreground underline-offset-4 hover:underline">
            Terms of Service
          </Link>
          {' and '}
          <Link href="#" className="text-foreground underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
        </span>
      </label>
      <Button type="submit" size="lg" className="w-full">
        Create account
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {'Already have an account? '}
        <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
