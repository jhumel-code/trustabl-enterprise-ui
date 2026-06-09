import { cn } from '@/lib/cn'

/** A metric tile: an uppercase label (with an optional semantic dot) on top, a
 *  prominent value, and an optional sub-detail line for context. The label is
 *  kept to a single line so tiles stay aligned in a dense grid. */
export function Stat({
  label,
  value,
  sub,
  dotClass,
}: {
  label: string
  value: number | string
  sub?: string
  dotClass?: string
}) {
  return (
    <div className="flex flex-col rounded-lg border bg-surface p-4">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
        {dotClass && <span className={cn('inline-block h-2 w-2 shrink-0 rounded-full', dotClass)} />}
        <span className="truncate">{label}</span>
      </span>
      <span className="mt-2 text-3xl font-bold leading-none tabular-nums text-fg">{value}</span>
      {sub && <span className="mt-1.5 text-xs text-fg-muted">{sub}</span>}
    </div>
  )
}
