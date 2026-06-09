import { integrations } from '@/data/platform'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { IntegrationCard } from '@/components/domain/IntegrationCard'

/** Control-plane integrations — connect SCM, SSO, ticketing, notifications, SIEM. */
export function IntegrationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Integrations"
        subtitle="Connect your stack"
        actions={<Button variant="primary">Add integration</Button>}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>

      <p className="text-xs text-fg-subtle">
        Air-gap ready: every integration must degrade to on-prem / offline endpoints — no
        outbound calls to a vendor cloud. Configure self-hosted SCM, IdP, and webhook targets
        so scans, gate checks, and exports keep working with no internet egress.
      </p>
    </div>
  )
}
