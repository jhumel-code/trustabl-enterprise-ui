import type { InventoryEntity } from '@/types'
import { inventory, inventoryEntities, surfaces } from '@/data/loadScan'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Stat } from '@/components/ui/Stat'
import { Tabs } from '@/components/ui/Tabs'
import { DataTable } from '@/components/ui/DataTable'
import type { Column } from '@/components/ui/DataTable'
import { SurfaceList } from '@/components/domain/SurfaceList'

/** Surfaces & Inventory — everything the scanner discovered, in one place. */
export function InventoryPage() {
  const columns: Column<InventoryEntity>[] = [
    { header: 'Kind', cell: (e) => <Badge>{e.kind}</Badge> },
    { header: 'Name', cell: (e) => <span className="font-medium text-fg">{e.name}</span> },
    {
      header: 'Location',
      className: 'font-mono text-xs text-fg-subtle',
      cell: (e) => (
        <span className="font-mono text-xs text-fg-subtle">
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
    <>
      <PageHeader
        title="Surfaces & Inventory"
        subtitle="Everything the scanner discovered"
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {inventory.map((i) => (
          <Stat key={i.label} label={i.label} value={i.n} />
        ))}
      </div>

      <div className="mt-6">
        <Tabs
          items={[
            {
              id: 'inventory',
              label: 'Inventory',
              count: inventoryEntities.length,
              content: (
                <Card className="p-0">
                  <div className="overflow-auto p-2">
                    <DataTable
                      columns={columns}
                      rows={inventoryEntities}
                      empty="No tools, agents, or skills were discovered in this repo."
                    />
                  </div>
                </Card>
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
    </>
  )
}
