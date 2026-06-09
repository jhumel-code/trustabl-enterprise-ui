import { Link, useNavigate } from 'react-router-dom'
import { FolderGit2, ShieldCheck, ShieldX, TriangleAlert } from 'lucide-react'
import type { RepoSummary } from '@/types'
import { findings } from '@/data/loadScan'
import { org, repos } from '@/data/platform'
import { pct, SEVERITY_ORDER } from '@/lib/format'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Stat } from '@/components/ui/Stat'
import { DataTable } from '@/components/ui/DataTable'
import { ScoreGauge } from '@/components/domain/ScoreGauge'
import { FindingTable } from '@/components/domain/FindingTable'
import { useToast } from '@/components/ui/Toast'
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
  const repoWord = repos.length === 1 ? 'repository' : 'repositories'

  const navigate = useNavigate()
  const toast = useToast()
  const topRepos = [...repos].sort(byRisk).slice(0, TOP_REPOS)
  const topFindings = [...findings]
    .sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity))
    .slice(0, 8)

  const repoColumns = [
    {
      header: 'Repository',
      cell: (r: RepoSummary) => <span className="truncate font-medium text-fg">{r.name}</span>,
    },
    {
      header: 'Gate',
      className: 'w-[90px]',
      cell: (r: RepoSummary) =>
        r.demo ? (
          <Badge tone="neutral">demo</Badge>
        ) : (
          <Badge variant="solid" tone={r.gate === 'pass' ? 'success' : 'danger'}>
            {r.gate}
          </Badge>
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
      className: 'w-[90px]',
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
    toast({ title: 'Report exported', description: 'overview.json downloaded.', tone: 'success' })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Overview"
        subtitle={`${org.name} · ${repos.length} ${repoWord}`}
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
              {repos.length === 1 ? 'Readiness of' : 'Mean across'} {repos.length} {repoWord}
            </div>
          </div>
        </Card>
        <Stat
          label="Repositories"
          value={repos.length}
          sub={`${repos.length} scanned`}
          icon={<FolderGit2 size={14} className="text-fg-muted" />}
        />
        <Stat
          label="Total findings"
          value={totalFindings}
          sub={`across ${repos.length} ${repoWord}`}
          icon={<TriangleAlert size={14} className="text-status-warning" />}
        />
        <Stat
          label="Gates failing"
          value={gatesFailing}
          sub={`of ${repos.length} ${repoWord}`}
          icon={
            gatesFailing > 0 ? (
              <ShieldX size={14} className="text-status-danger" />
            ) : (
              <ShieldCheck size={14} className="text-status-success" />
            )
          }
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
          <div>
            <h2 className="text-sm font-semibold">Top findings</h2>
            <p className="text-xs text-fg-subtle">Highest severity across the fleet</p>
          </div>
          <Link to="/findings" className="shrink-0 text-xs text-brand-emphasis hover:underline">
            View all {findings.length} →
          </Link>
        </div>
        <div className="overflow-auto p-2">
          <FindingTable findings={topFindings} sort="none" showRepo />
        </div>
      </Card>
    </div>
  )
}
