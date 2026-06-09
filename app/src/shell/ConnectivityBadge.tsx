import { deployment } from '@/config'
import { useOnlineStatus } from '@/lib/useOnlineStatus'
import { Badge } from '@/components/ui/Badge'

/** Top-bar status badge. In an air-gapped deployment it always reassures that
 *  offline is fine; otherwise it reflects live browser connectivity. */
export function ConnectivityBadge() {
  const online = useOnlineStatus()

  if (deployment.airGapped) {
    return (
      <Badge tone="brand" className="ml-auto">
        <span title="Self-hosted, air-gapped deployment — no external calls; scans run from the local rules cache.">
          ⛓ air-gapped · offline OK
        </span>
      </Badge>
    )
  }

  return online ? (
    <Badge tone="success" className="ml-auto">
      ● online
    </Badge>
  ) : (
    <Badge tone="warning" className="ml-auto">
      ● offline
    </Badge>
  )
}
