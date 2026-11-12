import { AuthShell } from '@/components/auth/auth-shell'
import { LoginForm } from '@/components/auth/login-form'

export const metadata = { title: 'Sign in — Hookline' }

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" description="Sign in to manage your webhook endpoints.">
      <LoginForm />
    </AuthShell>
  )
}
