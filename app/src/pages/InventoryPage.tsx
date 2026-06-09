import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { InventoryEntity } from '@/types'
import { inventoryEntities, surfaces } from '@/data/loadScan'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { TableCard } from '@/components/ui/TableCard'
import { Tabs } from '@/components/ui/Tabs'
import { SurfaceList } from '@/components/domain/SurfaceList'

type SortCol = 'kind' | 'name' | 'location'

const location = (e: InventoryEntity): string =>
  e.filePath ? `${e.filePath}${e.startLine ? `:${e.startLine}` : ''}` : ''

const sortKey = (e: InventoryEntity, col: SortCol): string =>
  col === 'location' ? location(e) : col === 'name' ? e.name : e.kind

const HEADERS: { id: SortCol | 'detail'; label: string; sortable: boolean; className?: string }[] = [
  { id: 'kind', label: 'Kind', sortable: true, className: 'w-24' },
  { id: 'name', label: 'Name', sortable: true },
  { id: 'location', label: 'Location', sortable: true },
  { id: 'detail', label: 'Detail', sortable: false, className: 'w-full' },
]

function InventoryTable() {
  const navigate = useNavigate()
  const [col, setCol] = useState<SortCol>('kind')
  const [dir, setDir] = useState<'asc' | 'desc'>('asc')

  function sortBy(c: SortCol) {
    if (c === col) setDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setCol(c)
      setDir('asc')
    }
  }

  const rows = [...inventoryEntities].sort((a, b) => {
    const cmp = sortKey(a, col).localeCompare(sortKey(b, col))
    return dir === 'asc' ? cmp : -cmp
  })

  return (
    <TableCard title="Inventory" count={inventoryEntities.length}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {HEADERS.map((h) => (
              <th
                key={h.id}
                className={
                  'border-b px-2.5 py-2 text-left align-bottom text-[11px] font-medium uppercase tracking-wide text-fg-subtle ' +
                  (h.className ?? '')
                }
              >
                {h.sortable ? (
                  <button
                    type="button"
                    onClick={() => sortBy(h.id as SortCol)}
                    className="inline-flex items-center gap-1 uppercase tracking-wide hover:text-fg"
                  >
                    {h.label}
                    <span className="text-fg-muted">{col === h.id ? (dir === 'asc' ? '↑' : '↓') : ''}</span>
                  </button>
                ) : (
                  h.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={HEADERS.length} className="px-2.5 py-6 text-center text-fg-muted">
                Nothing discovered in this repo.
              </td>
            </tr>
          ) : (
            rows.map((e, i) => (
              <tr
                key={i}
                onClick={() => navigate(e.kind === 'skill' ? `/skills/${e.name}` : `/surfaces/${e.name}`)}
                className="cursor-pointer border-b last:border-0 hover:bg-inset"
              >
                <td className="whitespace-nowrap px-2.5 py-2.5 align-top text-xs font-medium uppercase tracking-wide text-fg-muted">
                  {e.kind}
                </td>
                <td className="px-2.5 py-2.5 align-top font-medium text-fg">{e.name}</td>
                <td className="whitespace-nowrap px-2.5 py-2.5 align-top font-mono text-xs text-fg-subtle">
                  {location(e) || '—'}
                </td>
                <td className="px-2.5 py-2.5 align-top text-fg-muted">
                  <div className="line-clamp-2">{e.detail ?? '—'}</div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </TableCard>
  )
}

/** Surfaces & Inventory — a clean, sortable inventory of everything discovered. */
export function InventoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Surfaces & Inventory"
        subtitle={`${inventoryEntities.length} components · ${surfaces.length} analyzed surfaces`}
      />

      <Tabs
        items={[
          { id: 'inventory', label: 'Inventory', count: inventoryEntities.length, content: <InventoryTable /> },
          {
            id: 'surfaces',
            label: 'Surfaces',
            count: surfaces.length,
            content: (
              <Card>
                <SurfaceList surfaces={surfaces} />
              </Card>
            ),
          },
        ]}
      />
    </div>
  )
}
