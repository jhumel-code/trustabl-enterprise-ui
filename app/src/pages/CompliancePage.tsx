import { compliance } from '@/data/platform'
import { pct } from '@/lib/format'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

/** Compliance mapping — OWASP LLM Top 10:2025. Editorial coverage metadata
 *  from the rulebook; the engine emits no standards IDs on findings. */
export function CompliancePage() {
  const totalCovered = compliance.reduce((acc, c) => acc + c.covered, 0)
  const totalControls = compliance.reduce((acc, c) => acc + c.total, 0)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Compliance"
        subtitle="OWASP LLM Top 10:2025"
        actions={<Button variant="secondary">Export report</Button>}
      />

      <Card className="text-sm text-fg-muted">
        Standards mapping is editorial metadata from the rulebook — the engine
        emits no standards IDs on findings.
        <span className="ml-1 text-fg-subtle">
          {totalCovered}/{totalControls} controls mapped across {compliance.length}{' '}
          categories.
        </span>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {compliance.map((c) => {
          const ratio = c.total ? c.covered / c.total : 0
          return (
            <Card key={c.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-mono text-sm text-brand-emphasis">{c.id}</div>
                  <div className="mt-0.5 truncate text-sm font-medium text-fg">{c.name}</div>
                </div>
                <Badge tone={c.findings > 0 ? 'warning' : 'neutral'}>
                  {c.findings} {c.findings === 1 ? 'finding' : 'findings'}
                </Badge>
              </div>

              <div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-inset">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: pct(ratio) }}
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs text-fg-muted">
                  <span>
                    {c.covered}/{c.total} controls
                  </span>
                  <span className="font-mono text-fg-subtle">{pct(ratio)}</span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
