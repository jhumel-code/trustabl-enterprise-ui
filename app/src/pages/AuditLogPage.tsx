import type { ReactNode } from 'react'
import { auditEvents } from '@/data/platform'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { DataTable } from '@/components/ui/DataTable'

type AuditEvent = (typeof auditEvents)[number]

const columns: { header: string; cell: (row: AuditEvent) => ReactNode; className?: string }[] = [
  {
    header: 'Time',
    cell: (row) => <span className="font-mono text-xs text-fg-muted">{row.at}</span>,
  },
  {
    header: 'Actor',
    cell: (row) => <span className="text-fg">{row.actor}</span>,
  },
  {
    header: 'Action',
    cell: (row) => (
      <Badge tone="neutral">
        <span className="font-mono">{row.action}</span>
      </Badge>
    ),
  },
  {
    header: 'Target',
    cell: (row) => <span className="text-fg-muted">{row.target}</span>,
  },
]

/** Audit log (settings) — immutable, append-only record of control-plane events. */
export function AuditLogPage() {
  return (
    <>
      <PageHeader
        title="Audit log"
        subtitle="Immutable, append-only"
        actions={<Button variant="secondary">Export</Button>}
      />
      <Card className="p-0">
        <div className="overflow-auto p-2">
          <DataTable
            columns={columns}
            rows={auditEvents}
            empty="No audit events recorded yet."
          />
        </div>
      </Card>
    </>
  )
}
