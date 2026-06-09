import { useState } from 'react'
import type { Integration } from '@/types'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { StatusDot } from '@/components/ui/StatusDot'

const DOT = { connected: 'success', disconnected: 'subtle', error: 'danger' } as const

export function IntegrationCard({ integration }: { integration: Integration }) {
  const [open, setOpen] = useState(false)
  const [connected, setConnected] = useState(integration.status === 'connected')

  return (
    <div className="flex h-full flex-col rounded-lg border bg-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate font-medium">{integration.name}</div>
          <div className="text-xs text-fg-subtle">{integration.kind}</div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-fg-muted">
          <StatusDot tone={connected ? 'success' : DOT[integration.status]} />
          {connected ? 'connected' : integration.status}
        </span>
      </div>
      <p className="mt-2 text-sm text-fg-muted">{integration.detail}</p>
      <div className="mt-auto pt-3">
        <Button variant={connected ? 'ghost' : 'secondary'} onClick={() => setOpen(true)}>
          {connected ? 'Configure' : 'Connect'}
        </Button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`${connected ? 'Configure' : 'Connect'} ${integration.name}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setConnected(true)
                setOpen(false)
              }}
            >
              {connected ? 'Save' : 'Connect'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <div className="mb-1 text-xs uppercase tracking-wide text-fg-subtle">Endpoint</div>
            <Input placeholder={`https://${integration.id}.internal.example.com`} />
          </div>
          <div>
            <div className="mb-1 text-xs uppercase tracking-wide text-fg-subtle">API token / secret</div>
            <Input type="password" placeholder="••••••••" />
          </div>
          <p className="text-xs text-fg-subtle">
            Point at an on-prem / internal endpoint — no public SaaS required.
          </p>
        </div>
      </Modal>
    </div>
  )
}
