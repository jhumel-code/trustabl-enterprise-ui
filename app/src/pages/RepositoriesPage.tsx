import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { RepoSummary } from '@/types'
import { repos } from '@/data/platform'
import { pct } from '@/lib/format'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { DataTable } from '@/components/ui/DataTable'

/** All repositories — the full control-plane fleet list. Searchable by name and
 *  sortable on every column so it stays usable as the fleet grows; defaults to
 *  lowest-readiness first. The email-agent row links into the one real scan. */
export function RepositoriesPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const filtered = q ? repos.filter((r) => r.name.toLowerCase().includes(q)) : repos

  const columns = [
    {
      header: 'Repository',
      sortKey: (r: RepoSummary) => r.name,
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
      sortKey: (r: RepoSummary) => r.score,
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
      className: 'w-[100px] text-right',
      sortKey: (r: RepoSummary) => r.findings,
      cell: (r: RepoSummary) => <span className="font-mono tabular-nums text-fg">{r.findings}</span>,
    },
    {
      header: 'Last scan',
      className: 'w-[130px]',
      sortKey: (r: RepoSummary) => r.lastScan,
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
      <Card className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex items-baseline gap-2">
            <h2 className="text-sm font-semibold">Repositories</h2>
            <span className="text-xs text-fg-muted">
              {q ? `${filtered.length} of ${repos.length}` : `${repos.length} repos`}
            </span>
          </div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search repositories…"
            className="w-full max-w-[260px]"
          />
        </div>
        <div className="overflow-auto">
          <DataTable<RepoSummary>
            columns={columns}
            rows={filtered}
            onRowClick={(r) => navigate(`/repos/${r.id}`)}
            initialSort={{ col: 1, dir: 'asc' }}
            empty={q ? 'No repositories match your search.' : 'No repositories onboarded yet.'}
          />
        </div>
      </Card>
    </div>
  )
}
