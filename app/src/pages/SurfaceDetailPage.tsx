import { useState } from 'react'
import type { Finding, Surface } from '@/types'
import { surfaces, findingsForEntity } from '@/data/loadScan'
import { pct } from '@/lib/format'
import { cn } from '@/lib/cn'
import { PageHeader } from '@/components/ui/PageHeader'
import { TableCard } from '@/components/ui/TableCard'
import { Drawer } from '@/components/ui/Drawer'
import { ScopeBadge } from '@/components/domain/ScopeBadge'
import { FindingList } from '@/components/domain/FindingList'
import { FindingDetailPanel } from '@/components/domain/FindingDetailPanel'

type SortCol = 'kind' | 'name' | 'location' | 'findings' | 'score'

const HEADERS: { id: SortCol; label: string; align?: 'right'; className?: string }[] = [
  { id: 'kind', label: 'Kind', className: 'w-20' },
  { id: 'name', label: 'Surface' },
  { id: 'location', label: 'Location' },
  { id: 'findings', label: 'Findings', align: 'right' },
  { id: 'score', label: 'Readiness', align: 'right', className: 'w-44' },
]

function compare(a: Surface, b: Surface, col: SortCol): number {
  switch (col) {
    case 'findings':
      return a.findingCount - b.findingCount
    case 'score':
      return a.score - b.score
    case 'location':
      return a.filePath.localeCompare(b.filePath)
    case 'name':
      return (a.name || '').localeCompare(b.name || '')
    default:
      return a.kind.localeCompare(b.kind)
  }
}

/** Surfaces browser — sortable readiness table; detail + findings open in a drawer,
 *  and findings drill into the full detail (with actions) in place. */
export function SurfaceDetailPage() {
  const [selected, setSelected] = useState<Surface | null>(null)
  const [finding, setFinding] = useState<Finding | null>(null)
  const [col, setCol] = useState<SortCol>('score')
  const [dir, setDir] = useState<'asc' | 'desc'>('asc')

  function sortBy(c: SortCol) {
    if (c === col) setDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setCol(c)
      setDir('asc')
    }
  }

  const rows = [...surfaces].sort((a, b) => (dir === 'asc' ? compare(a, b, col) : -compare(a, b, col)))
  const detailFindings = selected ? findingsForEntity(selected.name, selected.filePath) : []

  return (
    <>
      <div className="flex flex-col gap-6">
        <PageHeader title="Surfaces" subtitle={`${surfaces.length} analyzed surfaces`} />

        <TableCard title="Surfaces" count={`${surfaces.length}`}>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {HEADERS.map((h) => (
                  <th
                    key={h.id}
                    className={cn(
                      'border-b px-3 py-2.5 align-bottom text-[11px] font-medium uppercase tracking-wide text-fg-subtle',
                      h.align === 'right' ? 'text-right' : 'text-left',
                      h.className,
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => sortBy(h.id)}
                      className="inline-flex items-center gap-1 uppercase tracking-wide hover:text-fg"
                    >
                      {h.label}
                      <span className="text-fg-muted">{col === h.id ? (dir === 'asc' ? '↑' : '↓') : ''}</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((s, i) => (
                <tr
                  key={i}
                  onClick={() => setSelected(s)}
                  className="cursor-pointer border-b last:border-0 hover:bg-inset"
                >
                  <td className="whitespace-nowrap px-3 py-3 align-middle text-xs font-semibold uppercase tracking-wide text-fg-muted">
                    {s.kind}
                  </td>
                  <td className="px-3 py-3 align-middle font-medium text-fg">{s.name || '(repo)'}</td>
                  <td className="px-3 py-3 align-middle">
                    <div className="max-w-[200px] truncate font-mono text-xs text-fg-subtle" title={s.filePath}>
                      {s.filePath || '—'}
                    </div>
                  </td>
                  <td className="px-3 py-3 align-middle text-right tabular-nums text-fg-muted">{s.findingCount}</td>
                  <td className="px-3 py-3 align-middle">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-inset">
                        <div className="h-full rounded-full bg-brand" style={{ width: pct(s.score) }} />
                      </div>
                      <span className="w-9 text-right font-semibold tabular-nums">{pct(s.score)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      </div>

      <Drawer
        open={!!selected}
        onClose={() => {
          setSelected(null)
          setFinding(null)
        }}
        title={finding ? 'Finding' : 'Surface'}
      >
        {finding ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setFinding(null)}
              className="text-sm text-brand-emphasis hover:underline"
            >
              ← Back to surface
            </button>
            <FindingDetailPanel
              key={`${finding.ruleId}:${finding.filePath}:${finding.startLine}`}
              finding={finding}
            />
          </div>
        ) : selected ? (
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
                <div className="text-xs text-fg-subtle">Readiness</div>
                <div className="text-lg font-semibold">{pct(selected.score)}</div>
              </div>
            </div>

            <div>
              <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
                {detailFindings.length} finding{detailFindings.length === 1 ? '' : 's'} on this surface
              </div>
              {detailFindings.length > 0 ? (
                <FindingList findings={detailFindings} onSelect={setFinding} />
              ) : (
                <div className="py-2 text-sm text-fg-muted">No findings attributed to this surface.</div>
              )}
            </div>
          </div>
        ) : null}
      </Drawer>
    </>
  )
}
