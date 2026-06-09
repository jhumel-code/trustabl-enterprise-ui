import type { InventoryEntity } from '@/types'
import { useNavigate } from 'react-router-dom'
import { inventory, inventoryEntities, surfaces } from '@/data/loadScan'
import { kindDot } from '@/lib/format'
import { cn } from '@/lib/cn'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { TableCard } from '@/components/ui/TableCard'
import { Stat } from '@/components/ui/Stat'
import { Tabs } from '@/components/ui/Tabs'
import { DataTable } from '@/components/ui/DataTable'
import type { Column } from '@/components/ui/DataTable'
import { SurfaceList } from '@/components/domain/SurfaceList'

// Map each summary tile to its entity kind for color-coding.
const LABEL_KIND: Record<string, string> = {
  Tools: 'tool',
  Agents: 'agent',
  Subagents: 'subagent',
  Skills: 'skill',
  'MCP servers': 'mcp',
  'Slash commands': '',
}

/** Surfaces & Inventory — everything the scanner discovered, in one place. */
export function InventoryPage() {
  const navigate = useNavigate()

  const columns: Column<InventoryEntity>[] = [
    {
      header: 'Kind',
      cell: (e) => (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-fg-muted">
          <span className={cn('h-2 w-2 rounded-full', kindDot(e.kind))} />
          {e.kind}
        </span>
      ),
    },
    { header: 'Name', cell: (e) => <span className="font-medium text-fg">{e.name}</span> },
    {
      header: 'Location',
      className: 'font-mono text-xs text-fg-subtle',
      cell: (e) => (
        <span>
          {e.filePath || '—'}
          {e.startLine ? `:${e.startLine}` : ''}
        </span>
      ),
    },
    {
      header: 'Detail',
      className: 'text-fg-muted',
      cell: (e) => <span className="text-fg-muted">{e.detail ?? '—'}</span>,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Surfaces & Inventory"
        subtitle="Everything the scanner discovered"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {inventory.map((i) => (
          <Stat key={i.label} label={i.label} value={i.n} dotClass={kindDot(LABEL_KIND[i.label] ?? '')} />
        ))}
      </div>

      <Tabs
        items={[
          {
            id: 'inventory',
            label: 'Inventory',
            count: inventoryEntities.length,
            content: (
              <TableCard title="Inventory" count={inventoryEntities.length}>
                <DataTable
                  columns={columns}
                  rows={inventoryEntities}
                  onRowClick={(e) =>
                    navigate(e.kind === 'skill' ? `/skills/${e.name}` : `/surfaces/${e.name}`)
                  }
                  empty="No tools, agents, or skills were discovered in this repo."
                />
              </TableCard>
            ),
          },
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
