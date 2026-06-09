import { pct } from '@/lib/format'

/** 0–1 confidence as a small bar + numeric. */
export function ConfidenceMeter({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-inset">
        <div className="h-full bg-brand" style={{ width: pct(value) }} />
      </div>
      <span className="text-xs text-fg-muted">{value.toFixed(2)}</span>
    </div>
  )
}
