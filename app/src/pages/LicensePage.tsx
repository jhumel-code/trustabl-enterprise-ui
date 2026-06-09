import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { license } from '@/data/platform'
import { pct } from '@/lib/format'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StatusDot } from '@/components/ui/StatusDot'

const usage = [
  { label: 'Seats', used: license.seatsUsed, cap: license.seats },
  { label: 'Repositories', used: license.reposUsed, cap: license.reposCap },
  { label: 'Agents', used: license.agentsUsed, cap: license.agentsCap },
]

const daysLeft = Math.max(0, Math.round((new Date(license.expiresAt).getTime() - Date.now()) / 86_400_000))

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b py-2.5 last:border-0">
      <span className="text-sm text-fg-muted">{label}</span>
      <span className="text-right text-sm text-fg">{children}</span>
    </div>
  )
}

/** License & entitlements — control-plane (platform-domain) data. */
export function LicensePage() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [keyName, setKeyName] = useState<string | null>(null)

  return (
    <div className="flex max-w-content flex-col gap-6">
      <PageHeader
        title="License"
        subtitle={`${license.issuedTo} · ${license.deployment}`}
        actions={
          <>
            <Badge variant="solid" tone="success">
              {license.status}
            </Badge>
            <Badge tone="brand">{license.tier}</Badge>
          </>
        }
      />

      <Card>
        <div className="mb-2 text-sm font-medium text-fg">License details</div>
        <div className="grid gap-x-10 sm:grid-cols-2">
          <div>
            <Row label="Plan">{license.tier}</Row>
            <Row label="License ID">
              <span className="font-mono text-xs">{license.licenseId}</span>
            </Row>
            <Row label="Issued to">{license.issuedTo}</Row>
            <Row label="Deployment">{license.deployment}</Row>
          </div>
          <div>
            <Row label="Issued">{license.issuedAt}</Row>
            <Row label="Expires">
              {license.expiresAt} <span className="text-fg-muted">· {daysLeft} days left</span>
            </Row>
            <Row label="Support">{license.support}</Row>
            <Row label="Status">
              <span className="inline-flex items-center gap-1.5">
                <StatusDot tone="success" />
                {license.status}
              </span>
            </Row>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <div className="text-sm font-medium text-fg">Usage</div>
          <div className="flex flex-col gap-4">
            {usage.map((u) => (
              <div key={u.label}>
                <div className="mb-1.5 flex items-baseline justify-between text-sm">
                  <span className="text-fg-muted">{u.label}</span>
                  <span className="font-mono text-fg-subtle">
                    {u.used}/{u.cap} · {pct(u.used / u.cap)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-inset">
                  <div className="h-full rounded-full bg-brand" style={{ width: pct(u.used / u.cap) }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col gap-4">
          <div className="text-sm font-medium text-fg">Entitlements</div>
          <ul className="flex flex-col gap-2">
            {license.entitlements.map((e) => (
              <li key={e.name} className="flex items-center gap-2 text-sm">
                {e.enabled ? (
                  <span className="text-status-success">✓</span>
                ) : (
                  <span className="text-fg-subtle">✕</span>
                )}
                <span className={e.enabled ? 'text-fg' : 'text-fg-subtle line-through'}>{e.name}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="flex flex-col gap-4">
        <div className="text-sm font-medium text-fg">Offline activation key</div>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) setKeyName(file.name)
          }}
        />
        {license.offlineKey || keyName ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <StatusDot tone="success" />
                <span className="text-fg-muted">Air-gap key</span>
                <span className="font-mono text-status-success">{keyName ?? 'active'}</span>
              </div>
              <div className="mt-1 font-mono text-xs text-fg-subtle">
                {license.offlineKeyFingerprint} · activated {license.activatedAt}
              </div>
            </div>
            <Button variant="ghost" onClick={() => fileRef.current?.click()}>
              Replace
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-fg-subtle">
              No offline key on file — required for air-gapped updates.
            </span>
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              Upload key
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
