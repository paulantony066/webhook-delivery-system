'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/form-field'
import { useAuth } from '@/components/context/auth-context'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('paulantony066@gmail.com')
  const [password, setPassword] = useState('12345')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { setUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Crucial: Allows the browser to accept and save the Express session cookie
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password')
      }

      // Route to dashboard on succes

      setUser(data.user)
      
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      
      <FormField
        id="email"
        label="Email"
        type="email"
        placeholder="you@company.com"
        autoComplete="email"
        value={email}
        onChange={(e: any) => setEmail(e.target.value)}
      />
      
      <FormField
        id="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        value={password}
        onChange={(e: any) => setPassword(e.target.value)}
        trailing={
          <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
            Forgot password?
          </Link>
        }
      />
      
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" name="remember" className="size-4 accent-primary" defaultChecked />
        Keep me signed in
      </label>
      
      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  )
}