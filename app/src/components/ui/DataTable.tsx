import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface Column<T> {
  header: string
  cell: (row: T) => ReactNode
  className?: string
  /** Provide to make the column sortable; returns the value to sort rows by. */
  sortKey?: (row: T) => string | number
}

type Sort = { col: number; dir: 'asc' | 'desc' }

/** Generic table. Pass typed columns + rows; optional row click + empty text.
 *  A column with a `sortKey` renders a clickable header and sorts in place;
 *  columns without one are non-interactive (fully backward-compatible). */
export function DataTable<T>({
  columns,
  rows,
  onRowClick,
  empty,
  initialSort,
}: {
  columns: Column<T>[]
  rows: T[]
  onRowClick?: (row: T) => void
  empty?: string
  initialSort?: Sort
}) {
  const [sort, setSort] = useState<Sort | null>(initialSort ?? null)

  const key = sort ? columns[sort.col]?.sortKey : undefined
  const sorted = key
    ? [...rows].sort((a, b) => {
        const av = key(a)
        const bv = key(b)
        const cmp =
          typeof av === 'number' && typeof bv === 'number'
            ? av - bv
            : String(av).localeCompare(String(bv))
        return sort!.dir === 'asc' ? cmp : -cmp
      })
    : rows

  function toggleSort(col: number) {
    setSort((s) => (s && s.col === col ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'asc' }))
  }

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
              {c.sortKey ? (
                <button
                  type="button"
                  onClick={() => toggleSort(i)}
                  className="inline-flex items-center gap-1 uppercase tracking-wide hover:text-fg"
                >
                  {c.header}
                  <span className="text-fg-muted">{sort?.col === i ? (sort.dir === 'asc' ? '↑' : '↓') : ''}</span>
                </button>
              ) : (
                c.header
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="px-3 py-6 text-center text-fg-muted">
              {empty ?? 'Nothing here yet.'}
            </td>
          </tr>
        ) : (
          sorted.map((row, ri) => (
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
