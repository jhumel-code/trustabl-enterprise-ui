import { Link } from 'react-router-dom'
import type { RepoSummary } from '@/types'
import { pct } from '@/lib/format'
import { Badge } from '@/components/ui/Badge'

/** A repo tile. Always links to the repo overview (/repos/:id), which then links
 *  one level deeper into the scan. Demo repos are visibly marked.
 *
 *  Layout note: the card is a full-height flex column and the metric row is
 *  pinned to the bottom (`mt-auto`). Because the grid stretches every tile to
 *  the tallest in its row, this keeps the readiness numbers on one baseline
 *  across the row regardless of how long each repo name is. */
export function RepoCard({ repo }: { repo: RepoSummary }) {
  return (
    <Link to={`/repos/${repo.id}`} className="block h-full">
      <div className="flex h-full flex-col rounded-lg border bg-surface p-4 transition-colors hover:border-strong">
        <div className="min-w-0">
          <div className="truncate font-medium" title={repo.name}>
            {repo.name}
          </div>
          <div className="mt-1.5">
            {repo.demo ? (
              <Badge tone="neutral">demo</Badge>
            ) : (
              <Badge variant="solid" tone={repo.gate === 'pass' ? 'success' : 'danger'}>
                {repo.gate}
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-auto pt-4">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-2xl font-bold leading-none">{pct(repo.score)}</span>
            <span className="shrink-0 text-xs text-fg-muted">{repo.findings} findings</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-2 text-xs text-fg-muted">
            <span className="truncate">readiness</span>
            <span className="shrink-0">{repo.lastScan}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
