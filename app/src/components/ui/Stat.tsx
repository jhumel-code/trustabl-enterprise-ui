import { cn } from '@/lib/cn'

export function Stat({
  label,
  value,
  dotClass,
}: {
  label: string
  value: number | string
  dotClass?: string
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border bg-surface p-4">
      <span className="text-2xl font-bold">{value}</span>
      <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
        {dotClass && <span className={cn('inline-block h-2 w-2 rounded-full', dotClass)} />}
        {label}
      </span>
    </div>
  )
}
