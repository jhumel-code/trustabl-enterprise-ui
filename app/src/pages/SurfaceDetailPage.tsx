import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Surface } from '@/types'
import { surfaces, findingsForEntity } from '@/data/loadScan'
import { PageHeader } from '@/components/ui/PageHeader'
import { TableCard } from '@/components/ui/TableCard'
import { DataTable } from '@/components/ui/DataTable'
import { Drawer } from '@/components/ui/Drawer'
import { ScopeBadge } from '@/components/domain/ScopeBadge'
import { FindingList } from '@/components/domain/FindingList'
import { pct } from '@/lib/format'

/** Surfaces browser — full-width list; the surface detail opens in a drawer. */
export function SurfaceDetailPage() {
  const [selected, setSelected] = useState<Surface | null>(null)

  const columns: { header: string; cell: (s: Surface) => ReactNode; className?: string }[] = [
    { header: 'Kind', cell: (s) => <ScopeBadge scope={s.kind} /> },
    { header: 'Name', cell: (s) => <span className="font-medium">{s.name || '(repo)'}</span> },
    {
      header: 'Location',
      cell: (s) => <span className="font-mono text-xs text-fg-muted">{s.filePath}</span>,
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
    <>
      <div className="flex flex-col gap-6">
        <PageHeader title="Surfaces" subtitle={`${surfaces.length} analyzed surfaces`} />
        <TableCard title="Surfaces" count={`${surfaces.length}`}>
          <DataTable<Surface>
            columns={columns}
            rows={surfaces}
            onRowClick={setSelected}
            empty="No surfaces analyzed in this scan."
          />
        </TableCard>
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Surface">
        {selected && (
          <div className="space-y-5">
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

            <div>
              <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
                {detailFindings.length} finding{detailFindings.length === 1 ? '' : 's'} on this surface
              </div>
              {detailFindings.length > 0 ? (
                <FindingList findings={detailFindings} />
              ) : (
                <div className="py-2 text-sm text-fg-muted">No findings attributed to this surface.</div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </>
  )
}
