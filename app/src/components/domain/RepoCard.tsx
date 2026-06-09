import { Link } from 'react-router-dom'
import type { RepoSummary } from '@/types'
import { pct } from '@/lib/format'
import { Badge } from '@/components/ui/Badge'

/** A repo tile. Always links to the repo overview (/repos/:id), which then links
 *  one level deeper into the scan. Demo repos are visibly marked. */
export function RepoCard({ repo }: { repo: RepoSummary }) {
  return (
    <Link to={`/repos/${repo.id}`} className="block">
      <div className="rounded-lg border bg-surface p-4 transition-colors hover:border-strong">
        <div className="flex items-center justify-between gap-2">
          <div className="font-medium">{repo.name}</div>
          {repo.demo ? (
            <Badge tone="neutral">demo</Badge>
          ) : (
            <Badge variant="solid" tone={repo.gate === 'pass' ? 'success' : 'danger'}>
              {repo.gate}
            </Badge>
          )}
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold">{pct(repo.score)}</div>
            <div className="text-xs text-fg-muted">readiness{repo.demo ? ' · demo' : ''}</div>
          </div>
          <div className="text-right text-xs text-fg-muted">
            <div>{repo.findings} findings</div>
            <div>{repo.lastScan}</div>
          </div>
        </div>
      </div>
    </Link>
  )
}
