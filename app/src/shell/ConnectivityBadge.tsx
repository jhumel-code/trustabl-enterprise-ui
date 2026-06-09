import { deployment } from '@/config'
import { useOnlineStatus } from '@/lib/useOnlineStatus'
import { Badge } from '@/components/ui/Badge'

/** Top-bar status badge. A local-only deployment shows the privacy posture;
 *  otherwise it reflects live browser connectivity. */
export function ConnectivityBadge() {
  const online = useOnlineStatus()

  if (deployment.localOnly) {
    return (
      <Badge tone="brand" className="ml-auto">
        <span title="Runs entirely in your environment — no telemetry or external calls; your code never leaves your infrastructure.">
          🔒 local · no telemetry
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
