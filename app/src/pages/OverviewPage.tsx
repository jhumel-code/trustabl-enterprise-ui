import { Link, useNavigate } from 'react-router-dom'
import type { RepoSummary } from '@/types'
import { findings } from '@/data/loadScan'
import { org, repos } from '@/data/platform'
import { pct } from '@/lib/format'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Stat } from '@/components/ui/Stat'
import { DataTable } from '@/components/ui/DataTable'
import { ScoreGauge } from '@/components/domain/ScoreGauge'
import { FindingTable } from '@/components/domain/FindingTable'
import { downloadFile } from '@/lib/download'

// On a dashboard the repo section is a prioritized summary, not the full list:
// surface the repos that need attention (failing gates first, then lowest
// readiness) and link to /repos for the complete, scrollable fleet table.
const TOP_REPOS = 8
const byRisk = (a: RepoSummary, b: RepoSummary) =>
  (a.gate === 'fail' ? 0 : 1) - (b.gate === 'fail' ? 0 : 1) || a.score - b.score

export function OverviewPage() {
  const avgScore = repos.reduce((sum, r) => sum + r.score, 0) / Math.max(repos.length, 1)
  const totalFindings = repos.reduce((sum, r) => sum + r.findings, 0)
  const gatesFailing = repos.filter((r) => r.gate === 'fail').length
  const demoCount = repos.filter((r) => r.demo).length
  const liveCount = repos.length - demoCount
  const liveFindings = repos.filter((r) => !r.demo).reduce((sum, r) => sum + r.findings, 0)
  const demoFindings = totalFindings - liveFindings

  const navigate = useNavigate()
  const topRepos = [...repos].sort(byRisk).slice(0, TOP_REPOS)

  const repoColumns = [
    {
      header: 'Repository',
      cell: (r: RepoSummary) => (
        <div className="flex items-center gap-2">
          <span className="truncate font-medium text-fg">{r.name}</span>
          {r.demo ? (
            <Badge tone="neutral">demo</Badge>
          ) : (
            <Badge variant="solid" tone={r.gate === 'pass' ? 'success' : 'danger'}>
              {r.gate}
            </Badge>
          )}
        </div>
      ),
    },
    {
      header: 'Readiness',
      className: 'w-[200px]',
      cell: (r: RepoSummary) => (
        <div className="flex items-center gap-2">
          <span className="w-9 font-mono text-xs tabular-nums text-fg">{pct(r.score)}</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-inset">
            <div className="h-full rounded-full bg-brand" style={{ width: pct(r.score) }} />
          </div>
        </div>
      ),
    },
    {
      header: 'Findings',
      className: 'w-[90px] text-right',
      cell: (r: RepoSummary) => <span className="font-mono tabular-nums text-fg">{r.findings}</span>,
    },
    {
      header: 'Last scan',
      className: 'w-[120px]',
      cell: (r: RepoSummary) => <span className="text-fg-muted">{r.lastScan}</span>,
    },
  ]

  function handleExport() {
    downloadFile('overview.json', JSON.stringify({ repos, findings: findings.length }, null, 2))
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Overview"
        subtitle={`${org.name} · ${repos.length} repositories`}
        actions={
          <Button variant="secondary" onClick={handleExport}>
            Export report
          </Button>
        }
      />

      {/* posture summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1.7fr_repeat(3,1fr)]">
        <Card className="flex items-center gap-4">
          <ScoreGauge value={avgScore} />
          <div className="min-w-0">
            <div className="text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
              Fleet readiness
            </div>
            <div className="mt-1 text-sm text-fg-muted">
              Mean across {repos.length} {repos.length === 1 ? 'repository' : 'repositories'}
            </div>
            <div className="mt-0.5 text-xs text-fg-subtle">
              {liveCount} live · {demoCount} demo
            </div>
          </div>
        </Card>
        <Stat
          label="Repositories"
          value={repos.length}
          sub={`${liveCount} live · ${demoCount} demo`}
          dotClass="bg-brand"
        />
        <Stat
          label="Total findings"
          value={totalFindings}
          sub={`${liveFindings} live · ${demoFindings} demo`}
          dotClass="bg-severity-medium"
        />
        <Stat
          label="Gates failing"
          value={gatesFailing}
          sub={`of ${repos.length} ${repos.length === 1 ? 'repository' : 'repositories'}`}
          dotClass={gatesFailing > 0 ? 'bg-severity-critical' : 'bg-status-success'}
        />
      </div>

      {/* repositories — prioritized summary; the full fleet lives on /repos */}
      <Card className="min-w-0 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold">Repositories</h2>
            <p className="text-xs text-fg-subtle">
              {repos.length > TOP_REPOS
                ? `Showing ${TOP_REPOS} most at-risk of ${repos.length}`
                : 'Most at-risk first'}
            </p>
          </div>
          <Link to="/repos" className="shrink-0 text-xs text-brand-emphasis hover:underline">
            View all {repos.length} →
          </Link>
        </div>
        <div className="overflow-auto">
          <DataTable<RepoSummary>
            columns={repoColumns}
            rows={topRepos}
            onRowClick={(r) => navigate(`/repos/${r.id}`)}
          />
        </div>
      </Card>

      {/* top findings */}
      <Card className="min-w-0 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-semibold">Top findings</h2>
          <span className="text-xs text-fg-muted">{findings.length} open</span>
        </div>
        <div className="overflow-auto p-2">
          <FindingTable findings={findings} />
        </div>
      </Card>
    </div>
  )
}
