import { Link } from 'react-router-dom'
import type { RepoSummary } from '@/types'
import { repos } from '@/data/platform'
import { pct } from '@/lib/format'
import { cn } from '@/lib/cn'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'

/** All repositories — control-plane fleet view. Mostly mock platform data;
 *  the email-agent row links into the one real loaded scan. */
export function RepositoriesPage() {
  const columns = [
    {
      header: 'Repository',
      cell: (r: RepoSummary) =>
        r.scanRoute ? (
          <Link to={r.scanRoute} className="font-medium text-brand hover:text-brand-emphasis">
            {r.name}
          </Link>
        ) : (
          <Link to="#" className="font-medium text-fg hover:text-brand">
            {r.name}
          </Link>
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
      header: 'Gate',
      className: 'w-[110px]',
      cell: (r: RepoSummary) => (
        <span
          className={cn(
            'inline-flex rounded-full px-2 py-0.5 text-xs font-medium text-fg-onbrand',
            r.gate === 'pass' ? 'bg-status-success' : 'bg-severity-critical',
          )}
        >
          {r.gate}
        </span>
      ),
    },
    {
      header: 'Findings',
      className: 'w-[100px] text-right',
      cell: (r: RepoSummary) => (
        <span className="font-mono tabular-nums text-fg">{r.findings}</span>
      ),
    },
    {
      header: 'Last scan',
      className: 'w-[130px]',
      cell: (r: RepoSummary) => <span className="text-fg-muted">{r.lastScan}</span>,
    },
  ]

  return (
    <>
      <PageHeader title="Repositories" subtitle={`${repos.length} repositories`} />
      <Card className="mt-6 p-0">
        <div className="overflow-auto p-2">
          <DataTable<RepoSummary> columns={columns} rows={repos} empty="No repositories onboarded yet." />
        </div>
      </Card>
    </>
  )
}
