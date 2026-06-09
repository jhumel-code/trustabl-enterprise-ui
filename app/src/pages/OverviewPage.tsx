import { findings } from '@/data/loadScan'
import { integrations, org, repos } from '@/data/platform'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Stat } from '@/components/ui/Stat'
import { ScoreGauge } from '@/components/domain/ScoreGauge'
import { RepoCard } from '@/components/domain/RepoCard'
import { FindingTable } from '@/components/domain/FindingTable'
import { cn } from '@/lib/cn'

const DOT = {
  connected: 'bg-status-success',
  disconnected: 'bg-fg-subtle',
  error: 'bg-status-danger',
} as const

export function OverviewPage() {
  const avgScore = repos.reduce((sum, r) => sum + r.score, 0) / Math.max(repos.length, 1)
  const totalFindings = repos.reduce((sum, r) => sum + r.findings, 0)
  const gatesFailing = repos.filter((r) => r.gate === 'fail').length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Overview"
        subtitle={`${org.name} · ${repos.length} repositories`}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary">Export report</Button>
            <Button variant="primary">Add repository</Button>
          </div>
        }
      />

      {/* posture summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[auto_1fr]">
        <Card className="flex items-center gap-4">
          <ScoreGauge value={avgScore} />
          <div>
            <div className="mb-1 text-xs text-fg-muted">Fleet readiness</div>
            <div className="text-sm text-fg-subtle">
              Mean across {repos.length} repositories
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Stat label="Repositories" value={repos.length} dotClass="bg-brand" />
          <Stat label="Total findings" value={totalFindings} dotClass="bg-severity-medium" />
          <Stat
            label="Gates failing"
            value={gatesFailing}
            dotClass={gatesFailing > 0 ? 'bg-severity-critical' : 'bg-status-success'}
          />
        </div>
      </div>

      {/* repositories */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {repos.map((r) => (
          <RepoCard key={r.id} repo={r} />
        ))}
      </div>

      {/* findings + integrations */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="min-w-0 p-0">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-sm font-semibold">Top findings</h2>
            <span className="text-xs text-fg-muted">{findings.length} open</span>
          </div>
          <div className="overflow-auto p-2">
            <FindingTable findings={findings} />
          </div>
        </Card>

        <Card className="p-0">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-sm font-semibold">Integrations</h2>
            <span className="text-xs text-fg-muted">
              {integrations.filter((i) => i.status === 'connected').length}/{integrations.length} connected
            </span>
          </div>
          <ul className="divide-y">
            {integrations.map((i) => (
              <li key={i.id} className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{i.name}</div>
                  <div className="truncate text-xs text-fg-subtle">{i.kind}</div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-fg-muted">
                  <span className={cn('h-2 w-2 rounded-full', DOT[i.status])} />
                  {i.status}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
