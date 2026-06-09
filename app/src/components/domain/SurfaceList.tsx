import type { Surface } from '@/types'
import { pct } from '@/lib/format'
import { cn } from '@/lib/cn'
import { ScopeBadge } from './ScopeBadge'

const scoreTone = (score: number) =>
  score < 0.4 ? 'text-status-danger' : score < 0.7 ? 'text-status-warning' : 'text-status-success'

/** Per-surface readiness, worst first. */
export function SurfaceList({ surfaces }: { surfaces: Surface[] }) {
  const rows = [...surfaces].sort((a, b) => a.score - b.score)
  return (
    <div className="divide-y">
      {rows.map((s, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-2.5">
          <div className="min-w-0">
            <div className="text-sm">{s.name || '(repo)'}</div>
            <div className="truncate font-mono text-xs text-fg-muted">{s.filePath}</div>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <ScopeBadge scope={s.kind} />
            <span className="text-xs text-fg-muted">{s.findingCount} findings</span>
            <span className={cn('w-10 text-right text-sm font-semibold tabular-nums', scoreTone(s.score))}>
              {pct(s.score)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
