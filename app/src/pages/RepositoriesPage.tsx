import { Link, useNavigate } from 'react-router-dom'
import type { RepoSummary } from '@/types'
import { repos } from '@/data/platform'
import { pct } from '@/lib/format'
import { PageHeader } from '@/components/ui/PageHeader'
import { TableCard } from '@/components/ui/TableCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { DataTable } from '@/components/ui/DataTable'

/** All repositories — control-plane fleet view. Mostly mock platform data;
 *  the email-agent row links into the one real loaded scan. */
export function RepositoriesPage() {
  const navigate = useNavigate()

  const columns = [
    {
      header: 'Repository',
      cell: (r: RepoSummary) => (
        <Link to={`/repos/${r.id}`} className="font-medium text-brand">
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
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Repositories"
        subtitle={`${repos.length} repositories`}
        actions={
          <Button variant="primary" onClick={() => navigate('/onboarding')}>
            Add repository
          </Button>
        }
      />
      <TableCard title="Repositories" count={`${repos.length} repos`}>
        <DataTable<RepoSummary> columns={columns} rows={repos} empty="No repositories onboarded yet." />
      </TableCard>
    </div>
  )
}
