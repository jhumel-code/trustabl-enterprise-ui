import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface Column<T> {
  header: string
  cell: (row: T) => ReactNode
  className?: string
}

/** Generic table. Pass typed columns + rows; optional row click + empty text. */
export function DataTable<T>({
  columns,
  rows,
  onRowClick,
  empty,
}: {
  columns: Column<T>[]
  rows: T[]
  onRowClick?: (row: T) => void
  empty?: string
}) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          {columns.map((c, i) => (
            <th
              key={i}
              className={cn(
                'border-b px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-fg-subtle',
                c.className,
              )}
            >
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="px-3 py-6 text-center text-fg-muted">
              {empty ?? 'Nothing here yet.'}
            </td>
          </tr>
        ) : (
          rows.map((row, ri) => (
            <tr
              key={ri}
              onClick={() => onRowClick?.(row)}
              className={cn('border-b last:border-0', onRowClick && 'cursor-pointer hover:bg-inset')}
            >
              {columns.map((c, ci) => (
                <td key={ci} className={cn('px-3 py-2.5 align-top', c.className)}>
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
