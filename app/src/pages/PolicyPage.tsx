import { policy, rulePacks } from '@/data/platform'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'

const THRESHOLDS = ['critical', 'high', 'medium', 'low'] as const

/** Policy editor — platform overlay. Gate rules + rule-pack selection.
 *  Static/non-functional toggles; the engine never produces this data. */
export function PolicyPage() {
  return (
    <div className="max-w-content">
      <PageHeader
        title="Policy"
        subtitle="Gate rules and rule selection (platform overlay)"
        actions={<Button variant="primary">Save policy</Button>}
      />

      <div className="mt-6 flex flex-col gap-6">
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
                <button
                  key={sev}
                  type="button"
                  className={cn(
                    'rounded-md focus:outline-none',
                    active && 'ring-1 ring-brand-emphasis',
                  )}
                >
                  <Badge tone={active ? 'brand' : 'neutral'}>
                    <span className="capitalize">{sev}</span>
                  </Badge>
                </button>
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
            <span
              className={cn(
                'rounded-full px-2.5 py-0.5 text-xs font-medium',
                policy.strict
                  ? 'bg-status-success text-fg-onbrand'
                  : 'bg-inset text-fg-muted',
              )}
            >
              {policy.strict ? 'on' : 'off'}
            </span>
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
                  <span
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-sm border text-[10px] leading-none',
                      selected
                        ? 'border-brand-emphasis bg-brand text-fg-onbrand'
                        : 'border-strong text-transparent',
                    )}
                    aria-checked={selected}
                    role="checkbox"
                  >
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
                <span
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-xs font-medium',
                    g.on
                      ? 'bg-status-success text-fg-onbrand'
                      : 'bg-inset text-fg-muted',
                  )}
                >
                  {g.on ? 'on' : 'off'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
