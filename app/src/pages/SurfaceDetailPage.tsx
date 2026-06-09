import { useState } from 'react'
import type { Surface } from '@/types'
import { surfaces, findingsForEntity } from '@/data/loadScan'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { TableCard } from '@/components/ui/TableCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { DataTable } from '@/components/ui/DataTable'
import { ScopeBadge } from '@/components/domain/ScopeBadge'
import { FindingTable } from '@/components/domain/FindingTable'
import { pct } from '@/lib/format'

/** Surfaces browser — list-detail over the loaded scan's analyzed surfaces. */
export function SurfaceDetailPage() {
  const [selected, setSelected] = useState<Surface>(surfaces[0])

  const columns: { header: string; cell: (s: Surface) => React.ReactNode; className?: string }[] = [
    { header: 'Kind', cell: (s) => <ScopeBadge scope={s.kind} /> },
    { header: 'Name', cell: (s) => <span className="font-medium">{s.name || '(repo)'}</span> },
    {
      header: 'Location',
      cell: (s) => <span className="truncate font-mono text-xs text-fg-muted">{s.filePath}</span>,
    },
    { header: 'Findings', cell: (s) => s.findingCount, className: 'text-right tabular-nums' },
    {
      header: 'Score',
      cell: (s) => <span className="font-semibold">{pct(s.score)}</span>,
      className: 'text-right tabular-nums',
    },
  ]

  const detailFindings = selected ? findingsForEntity(selected.name, selected.filePath) : []

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Surfaces" subtitle={`${surfaces.length} analyzed surfaces`} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <TableCard title="Surfaces" count={`${surfaces.length}`}>
            <DataTable<Surface>
              columns={columns}
              rows={surfaces}
              onRowClick={setSelected}
              empty="No surfaces analyzed in this scan."
            />
          </TableCard>
        </div>

        <aside className="flex flex-col gap-6">
          {selected ? (
            <Card className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-1">
                    <ScopeBadge scope={selected.kind} />
                  </div>
                  <div className="truncate text-base font-semibold">{selected.name || '(repo)'}</div>
                  <div className="truncate font-mono text-xs text-fg-muted">{selected.filePath}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-xs text-fg-subtle">Score</div>
                  <div className="text-lg font-semibold">{pct(selected.score)}</div>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
                  {detailFindings.length} finding{detailFindings.length === 1 ? '' : 's'} on this surface
                </div>
                {detailFindings.length > 0 ? (
                  <div className="overflow-auto">
                    <FindingTable findings={detailFindings} />
                  </div>
                ) : (
                  <div className="py-4 text-sm text-fg-muted">No findings attributed to this surface.</div>
                )}
              </div>
            </Card>
          ) : (
            <EmptyState
              title="No surface selected"
              description="Select a surface to inspect its findings."
            />
          )}
        </aside>
      </div>
    </div>
  )
}
