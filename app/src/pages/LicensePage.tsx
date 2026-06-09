import { license } from '@/data/platform'
import { pct } from '@/lib/format'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const usage = [
  { label: 'Seats', used: license.seatsUsed, cap: license.seats },
  { label: 'Repos', used: license.reposUsed, cap: license.reposCap },
  { label: 'Agents', used: license.agentsUsed, cap: license.agentsCap },
]

/** License & entitlements — control-plane (platform-domain) data. */
export function LicensePage() {
  return (
    <div className="flex flex-col gap-6 max-w-content">
      <PageHeader
        title="License"
        subtitle={`${license.tier} · expires ${license.expiresAt}`}
        actions={<Badge tone="brand">{license.tier}</Badge>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <div className="text-sm font-medium text-fg">Usage</div>
          <div className="flex flex-col gap-4">
            {usage.map((u) => (
              <div key={u.label}>
                <div className="mb-1.5 flex items-baseline justify-between text-sm">
                  <span className="text-fg-muted">{u.label}</span>
                  <span className="font-mono text-fg-subtle">
                    {u.used}/{u.cap}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-inset">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: pct(u.used / u.cap) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col gap-4">
          <div className="text-sm font-medium text-fg">Entitlements</div>
          <div className="flex flex-wrap gap-2">
            {license.entitlements.map((e) => (
              <Badge key={e} tone="neutral">
                {e}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col gap-4 lg:col-span-2">
          <div className="text-sm font-medium text-fg">Offline key</div>
          {license.offlineKey ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-status-success" />
                <span className="text-fg-muted">Air-gap key</span>
                <span className="font-mono text-status-success">uploaded</span>
              </div>
              <Button variant="ghost">Replace</Button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm text-fg-subtle">
                No offline key on file — required for air-gapped updates.
              </span>
              <Button variant="secondary">Upload key</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
