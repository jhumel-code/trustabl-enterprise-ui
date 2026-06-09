import type { ReactNode } from 'react'
import { org } from '@/data/platform'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

function KeyValue({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm text-fg-muted">{label}</span>
      <span className="text-sm text-fg">{value}</span>
    </div>
  )
}

/** Organization settings — self-hosted deployment + offline update controls. */
export function OrganizationPage() {
  return (
    <div className="flex max-w-content flex-col gap-6">
      <PageHeader title="Organization" subtitle={org.deployment} />

      <div className="flex flex-col gap-6">
        <Card>
          <h2 className="mb-2 text-sm font-semibold text-fg">General</h2>
          <div className="divide-y divide-[var(--border-default)]">
            <KeyValue label="Name" value={org.name} />
            <KeyValue label="Deployment" value={org.deployment} />
            <KeyValue label="Data retention" value={`${org.retentionDays} days`} />
          </div>
        </Card>

        <Card>
          <h2 className="mb-2 text-sm font-semibold text-fg">Offline updates</h2>
          <div className="divide-y divide-[var(--border-default)]">
            <div className="flex items-center justify-between gap-4 py-2">
              <div>
                <div className="text-sm text-fg-muted">Rules pinned</div>
                <div className="font-mono text-sm text-fg">{org.rulesPinned}</div>
              </div>
              <Button variant="secondary" disabled title="offline pull not yet wired">
                Pull
              </Button>
            </div>
            <div className="flex items-center justify-between gap-4 py-2">
              <div>
                <div className="text-sm text-fg-muted">Vuln DB pinned</div>
                <div className="font-mono text-sm text-fg">{org.vulndbPinned}</div>
              </div>
              <Button variant="secondary" disabled title="offline pull not yet wired">
                Pull
              </Button>
            </div>
          </div>
          <p className="mt-3 text-xs text-fg-subtle">
            Pulls fetch an offline mirror and pin a version. No outbound network access is
            required at scan time once a version is pinned.
          </p>
        </Card>
      </div>
    </div>
  )
}
