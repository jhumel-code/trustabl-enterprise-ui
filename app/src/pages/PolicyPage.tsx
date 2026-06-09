import { policy, rulePacks } from '@/data/platform'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const THRESHOLDS = ['critical', 'high', 'medium', 'low'] as const

/** Policy view — platform overlay. Gate rules + rule-pack selection.
 *  Read-only: the engine never produces this data, so nothing is editable. */
export function PolicyPage() {
  return (
    <div className="flex flex-col gap-6 max-w-content">
      <PageHeader
        title="Policy"
        subtitle="Current policy (read-only)"
      />

      {/* Failure threshold */}
      <Card>
        <div className="text-sm font-semibold">Failure threshold</div>
        <p className="mt-0.5 text-xs text-fg-muted">
          A scan fails the gate when it has any finding at or above this severity.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {THRESHOLDS.map((sev) => {
            const active = policy.failThreshold === sev
            return (
              <Badge key={sev} tone={active ? 'brand' : 'neutral'}>
                <span className="capitalize">{sev}</span>
              </Badge>
            )
          })}
        </div>
        <div className="mt-4 flex items-center justify-between border-t pt-3">
          <div>
            <div className="text-sm">Strict mode</div>
            <div className="text-xs text-fg-muted">
              Treat unknown / forward-incompatible rules as failures.
            </div>
          </div>
          <Badge variant="solid" tone={policy.strict ? 'success' : 'neutral'}>
            {policy.strict ? 'on' : 'off'}
          </Badge>
        </div>
      </Card>

      {/* Rule packs */}
      <Card>
        <div className="text-sm font-semibold">Rule packs</div>
        <p className="mt-0.5 text-xs text-fg-muted">
          Selected packs run against every scan in this org.
        </p>
        <div className="mt-3 flex flex-col divide-y">
          {rulePacks.map((pack) => {
            const selected = policy.selectedPacks.includes(pack.id)
            return (
              <div key={pack.id} className="flex items-center gap-3 py-2.5">
                <span className="w-4 text-center text-status-success" aria-hidden={!selected}>
                  {selected ? '✓' : ''}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-fg">{pack.name}</div>
                  <div className="font-mono text-xs text-fg-subtle">{pack.source} · {pack.version}</div>
                </div>
                <Badge tone="neutral">{pack.category}</Badge>
                <span className="w-16 text-right text-xs text-fg-muted">
                  {pack.rules} rules
                </span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Gates */}
      <Card>
        <div className="text-sm font-semibold">Gates</div>
        <p className="mt-0.5 text-xs text-fg-muted">
          Enforcement actions applied when a gate condition is met.
        </p>
        <div className="mt-3 flex flex-col divide-y">
          {policy.gates.map((g) => (
            <div key={g.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0 text-sm text-fg">{g.label}</div>
              <Badge variant="solid" tone={g.on ? 'success' : 'neutral'}>
                {g.on ? 'on' : 'off'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
