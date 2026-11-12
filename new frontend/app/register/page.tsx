import { AuthShell } from '@/components/auth/auth-shell'
import { RegisterForm } from '@/components/auth/register-form'

export const metadata = { title: 'Create account — Hookline' }

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Start delivering reliable webhooks in minutes."
    >
      <RegisterForm />
    </AuthShell>
  )
}
