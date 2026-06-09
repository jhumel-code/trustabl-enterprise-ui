import type { ProjectedScores } from '@/types'
import { pct } from '@/lib/format'

const ROWS: Array<{ key: keyof ProjectedScores; label: string }> = [
  { key: 'fixCritical', label: 'Fix critical' },
  { key: 'fixAll', label: 'Fix all' },
]

/** Headroom ladder — binds directly to engine projected_scores (never recomputed). */
export function ProjectedScoreLadder({ value }: { value: ProjectedScores }) {
  return (
    <div className="text-xs text-fg-muted">
      {ROWS.map((r) => (
        <div key={r.key}>
          {r.label} → {pct(value[r.key])}
          <div className="my-1 mb-2.5 h-1.5 overflow-hidden rounded-full bg-inset">
            <div className="h-full bg-brand" style={{ width: pct(value[r.key]) }} />
          </div>
        </div>
      ))}
    </div>
  )
}
