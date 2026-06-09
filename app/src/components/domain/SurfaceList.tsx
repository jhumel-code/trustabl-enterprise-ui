import type { Surface } from '@/types'
import { pct } from '@/lib/format'
import { ScopeBadge } from './ScopeBadge'

/** Per-surface readiness, worst first. Pass `showRepo` in fleet contexts to
 *  attribute each surface to its repository. */
export function SurfaceList({ surfaces, showRepo = false }: { surfaces: Surface[]; showRepo?: boolean }) {
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
            {showRepo && <span className="text-xs text-fg-subtle">{s.repoId}</span>}
            <ScopeBadge scope={s.kind} />
            <span className="text-xs text-fg-muted">{s.findingCount} findings</span>
            <span className="w-10 text-right text-sm font-semibold tabular-nums">{pct(s.score)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
