import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'

// Brand marks (lucide dropped its brand glyphs). currentColor where the mark is
// monochrome so it adapts to the theme; explicit brand colors otherwise.
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#4285F4" d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.87z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.88-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.09A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.26a12 12 0 0 0 0 10.76l4.01-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.26 6.62l4.01 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  )
}
function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.82-.26.82-.58v-2.02c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.13-.3-.54-1.53.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.23 0 4.63-2.81 5.65-5.49 5.95.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3z" />
    </svg>
  )
}
function GitLabIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#E24329" d="M12 21.42l3.684-11.333H8.316L12 21.42z" />
      <path fill="#FC6D26" d="M12 21.42L8.316 10.087H3.155L12 21.42z" />
      <path fill="#FCA326" d="M3.155 10.087l-1.12 3.444a.763.763 0 0 0 .277.853L12 21.42 3.155 10.087z" />
      <path fill="#E24329" d="M3.155 10.087h5.161L6.098 3.262a.382.382 0 0 0-.726 0l-2.217 6.825z" />
      <path fill="#FC6D26" d="M12 21.42l3.684-11.333h5.161L12 21.42z" />
      <path fill="#FCA326" d="M20.845 10.087l1.12 3.444a.763.763 0 0 1-.277.853L12 21.42l8.845-11.333z" />
      <path fill="#E24329" d="M20.845 10.087h-5.161l2.218-6.825a.382.382 0 0 1 .726 0l2.217 6.825z" />
    </svg>
  )
}
function OktaIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="#007DC1" strokeWidth="5" />
    </svg>
  )
}

const PROVIDERS: { id: string; label: string; icon: ReactNode }[] = [
  { id: 'google', label: 'Google', icon: <GoogleIcon /> },
  { id: 'github', label: 'GitHub', icon: <GitHubIcon /> },
  { id: 'gitlab', label: 'GitLab', icon: <GitLabIcon /> },
  { id: 'okta', label: 'Okta', icon: <OktaIcon /> },
]

/** Top-level login route — SSO only, no passwords. Renders outside the app shell
 *  and fills the screen. Each provider is a stub that signs the demo user in. */
export function LoginPage() {
  const navigate = useNavigate()
  return (
    <div className="grid min-h-screen place-items-center bg-canvas p-6">
      <Card className="w-full max-w-[400px]">
        <div className="flex flex-col items-center text-center">
          <img src={`${import.meta.env.BASE_URL}brand/logo-mark.png`} className="h-10 w-10" alt="" />
          <h1 className="mt-4 text-lg font-semibold">Sign in to Trustabl</h1>
          <p className="mt-1 text-sm text-fg-muted">Continue with your single sign-on provider.</p>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => navigate('/')}
              className="flex w-full items-center justify-center gap-3 rounded-md border border-strong bg-surface px-4 py-2.5 text-sm font-medium text-fg transition-colors hover:border-brand hover:bg-inset"
            >
              <span className="grid h-[18px] w-[18px] shrink-0 place-items-center">{p.icon}</span>
              Continue with {p.label}
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-fg-subtle">
          SSO only — access is provisioned through your organization's identity provider. No passwords.
        </p>
      </Card>
    </div>
  )
}
