import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

/** Top-level login route — renders outside the app shell and fills the screen. */
export function LoginPage() {
  const navigate = useNavigate()
  return (
    <div className="grid min-h-screen place-items-center bg-canvas p-6">
      <Card className="w-full max-w-[380px]">
        <img src={`${import.meta.env.BASE_URL}brand/logo-mark.png`} className="mx-auto h-10 w-10" alt="" />
        <h1 className="mt-4 text-center text-lg font-semibold">Sign in to Trustabl Enterprise</h1>
        <p className="mt-1 text-center text-sm text-fg-muted">
          Use your organization identity provider to continue.
        </p>

        <Button variant="primary" className="mt-6 w-full" onClick={() => navigate('/')}>
          Continue with SSO (SAML / OIDC)
        </Button>

        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-fg-subtle">
          <span className="h-px flex-1 bg-[var(--border-strong)]" />
          or
          <span className="h-px flex-1 bg-[var(--border-strong)]" />
        </div>

        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            navigate('/')
          }}
        >
          <Input
            type="email"
            autoComplete="username"
            placeholder="Work email"
            className="w-full"
          />
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            className="w-full"
          />
          <Button variant="secondary" type="submit" className="w-full">
            Sign in
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-fg-subtle">
          air-gapped · SSO via internal IdP
        </p>
      </Card>
    </div>
  )
}
