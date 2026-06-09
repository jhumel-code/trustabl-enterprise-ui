import { useState } from 'react'
import { waivers } from '@/data/platform'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { DataTable } from '@/components/ui/DataTable'

type Waiver = (typeof waivers)[number]
type StatusFilter = 'all' | 'active' | 'expired' | 'revoked'

const STATUS_TONE = {
  active: 'success',
  expired: 'neutral',
  revoked: 'danger',
} as const

const FILTERS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'expired', label: 'Expired' },
  { id: 'revoked', label: 'Revoked' },
]

const columns: { header: string; cell: (row: Waiver) => React.ReactNode; className?: string }[] = [
  {
    header: 'Rule',
    cell: (w) => <span className="font-mono text-xs text-fg">{w.ruleId}</span>,
  },
  {
    header: 'Finding',
    cell: (w) => <span className="text-fg">{w.title}</span>,
  },
  {
    header: 'Reason',
    cell: (w) => <span className="text-fg-muted">{w.reason}</span>,
  },
  {
    header: 'Approved by',
    cell: (w) => <span className="font-mono text-xs text-fg-muted">{w.approvedBy}</span>,
  },
  {
    header: 'Expires',
    cell: (w) => <span className="font-mono text-xs text-fg-muted">{w.expiresAt}</span>,
  },
  {
    header: 'Status',
    cell: (w) => <Badge tone={STATUS_TONE[w.status]}>{w.status}</Badge>,
  },
]

/** Waivers register — platform-domain. Suppressed findings with approver,
 *  reason, and expiry. Filterable by lifecycle status. */
export function WaiversPage() {
  const [filter, setFilter] = useState<StatusFilter>('all')

  const rows = filter === 'all' ? waivers : waivers.filter((w) => w.status === filter)
  const countFor = (id: StatusFilter) =>
    id === 'all' ? waivers.length : waivers.filter((w) => w.status === id).length

  return (
    <div>
      <PageHeader title="Waivers" subtitle={`${waivers.length} waivers`} />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => {
          const active = filter === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={
                'flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors ' +
                (active
                  ? 'border-strong bg-surface-raised text-fg'
                  : 'border bg-surface text-fg-muted hover:text-fg')
              }
            >
              {f.label}
              <span className="rounded-full bg-inset px-1.5 text-xs text-fg-subtle">{countFor(f.id)}</span>
            </button>
          )
        })}
      </div>

      <Card className="p-0">
        <div className="overflow-auto p-2">
          <DataTable
            columns={columns}
            rows={rows}
            empty={`No ${filter === 'all' ? '' : filter + ' '}waivers.`}
          />
        </div>
      </Card>
    </div>
  )
}
