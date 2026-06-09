import type { ReactNode } from 'react'
import { Card } from './Card'

/** Standard list/table card: a titled header strip + a scrollable table body.
 *  The single pattern every list page uses. */
export function TableCard({ title, count, children }: { title: string; count?: ReactNode; children: ReactNode }) {
  return (
    <Card className="p-0">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        {count != null && <span className="text-xs text-fg-muted">{count}</span>}
      </div>
      <div className="overflow-auto p-2">{children}</div>
    </Card>
  )
}
