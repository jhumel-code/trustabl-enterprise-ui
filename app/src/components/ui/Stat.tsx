import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** A metric tile: a label (with an optional leading icon or semantic dot) on
 *  top, a prominent value, and an optional sub-detail line. Pass `icon` for a
 *  meaningful glyph (KPI tiles) or `dotClass` for a colored status dot (e.g. the
 *  per-scan severity counts); `icon` wins if both are given. */
export function Stat({
  label,
  value,
  sub,
  dotClass,
  icon,
}: {
  label: string
  value: number | string
  sub?: string
  dotClass?: string
  icon?: ReactNode
}) {
  return (
    <div className="flex flex-col rounded-lg border bg-surface p-4">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
        {icon ?? (dotClass ? <span className={cn('inline-block h-2 w-2 shrink-0 rounded-full', dotClass)} /> : null)}
        <span className="truncate">{label}</span>
      </span>
      <span className="mt-2 text-3xl font-bold leading-none tabular-nums text-fg">{value}</span>
      {sub && <span className="mt-1.5 text-xs text-fg-muted">{sub}</span>}
    </div>
  )
}
