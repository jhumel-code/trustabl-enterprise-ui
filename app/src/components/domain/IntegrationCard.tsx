import type { Integration } from '@/types'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'

const DOT: Record<Integration['status'], string> = {
  connected: 'bg-status-success',
  disconnected: 'bg-fg-subtle',
  error: 'bg-status-danger',
}

export function IntegrationCard({ integration }: { integration: Integration }) {
  return (
    <div className="rounded-lg border bg-surface p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{integration.name}</div>
          <div className="text-xs text-fg-subtle">{integration.kind}</div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
          <span className={cn('h-2 w-2 rounded-full', DOT[integration.status])} />
          {integration.status}
        </span>
      </div>
      <p className="mt-2 text-sm text-fg-muted">{integration.detail}</p>
      <div className="mt-3">
        <Button variant={integration.status === 'connected' ? 'ghost' : 'secondary'}>
          {integration.status === 'connected' ? 'Configure' : 'Connect'}
        </Button>
      </div>
    </div>
  )
}
