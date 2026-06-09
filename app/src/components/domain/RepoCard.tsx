import { Link } from 'react-router-dom'
import type { RepoSummary } from '@/types'
import { pct } from '@/lib/format'
import { cn } from '@/lib/cn'

export function RepoCard({ repo }: { repo: RepoSummary }) {
  const body = (
    <div className="rounded-lg border bg-surface p-4 transition-colors hover:border-strong">
      <div className="flex items-center justify-between">
        <div className="font-medium">{repo.name}</div>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-[11px] font-semibold text-white',
            repo.gate === 'pass' ? 'bg-status-success' : 'bg-severity-critical',
          )}
        >
          {repo.gate}
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold">{pct(repo.score)}</div>
          <div className="text-xs text-fg-muted">readiness</div>
        </div>
        <div className="text-right text-xs text-fg-muted">
          <div>{repo.findings} findings</div>
          <div>{repo.lastScan}</div>
        </div>
      </div>
    </div>
  )
  return repo.scanRoute ? (
    <Link to={repo.scanRoute} className="block">
      {body}
    </Link>
  ) : (
    body
  )
}
