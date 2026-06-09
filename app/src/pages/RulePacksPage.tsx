import { scan } from '@/data/loadScan'
import { rulePacks } from '@/data/platform'
import { originIsWarning, originLabel, shortRef, sourceLabel } from '@/lib/format'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'

type RulePack = (typeof rulePacks)[number]

export function RulePacksPage() {
  const originWarn = originIsWarning(scan.rulesOrigin)
  const totalRules = rulePacks.reduce((sum, p) => sum + p.rules, 0)

  const columns = [
    {
      header: 'Pack',
      cell: (p: RulePack) => <span className="font-medium text-fg">{p.name}</span>,
    },
    {
      header: 'Category',
      cell: (p: RulePack) => <Badge>{p.category}</Badge>,
    },
    {
      header: 'Version',
      cell: (p: RulePack) => <span className="font-mono text-fg-muted">{shortRef(p.version)}</span>,
    },
    {
      header: 'Source',
      cell: (p: RulePack) => <span className="text-fg-muted">{p.source}</span>,
    },
    {
      header: 'Rules',
      cell: (p: RulePack) => <span className="font-mono tabular-nums">{p.rules}</span>,
      className: 'text-right',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Rule packs"
        subtitle="Detection rules resolved from trustabl-rules"
        actions={<Button variant="secondary">Check for updates</Button>}
      />

      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-fg-subtle">Provenance</div>
            <h2 className="mt-0.5 text-sm font-semibold text-fg">Resolved rule source</h2>
          </div>
          <Badge tone={originWarn ? 'warning' : 'success'}>{originLabel(scan.rulesOrigin)}</Badge>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-fg-subtle">Source</dt>
            <dd className="mt-0.5 text-sm text-fg">{sourceLabel(scan.rulesSource)}</dd>
          </div>
          <div>
            <dt className="text-xs text-fg-subtle">Version</dt>
            <dd className="mt-0.5 font-mono text-sm text-fg">{shortRef(scan.rulesVersion)}</dd>
          </div>
          <div>
            <dt className="text-xs text-fg-subtle">Resolution</dt>
            <dd className="mt-0.5 text-sm text-fg">
              {scan.rulesFromCache ? 'served from cache' : 'fetched from origin'}
            </dd>
          </div>
        </dl>

        <p className="rounded-md border bg-inset p-3 text-xs text-fg-muted">
          Signed rule channels are not yet live — every scan currently resolves the{' '}
          <span className="font-mono text-fg">unsigned-default</span> source. Rules are pulled by
          commit ref from the public <span className="font-mono text-fg">trustabl-rules</span>{' '}
          repository and are not signature-verified.
        </p>
      </Card>

      <Card className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold text-fg">Loaded packs</h2>
          <span className="text-xs text-fg-subtle">
            {rulePacks.length} packs · {totalRules} rules
          </span>
        </div>
        <DataTable<RulePack>
          columns={columns}
          rows={rulePacks}
          empty="No rule packs resolved."
        />
      </Card>
    </div>
  )
}
