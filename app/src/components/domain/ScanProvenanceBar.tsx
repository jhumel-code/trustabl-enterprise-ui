import type { ReactNode } from 'react'
import type { Scan } from '@/types'
import { originIsWarning, originLabel, rulesWatermark, shortRef, truncId } from '@/lib/format'
import { Badge } from '@/components/ui/Badge'

/** The trust wedge: ScanID + rules version + the full RulesOrigin provenance
 *  surface (signed/unsigned/custom badge, Watermark() banner, stale / schema-newer
 *  / skipped). `right` slots the GateStatus on the far end. */
export function ScanProvenanceBar({ scan, right }: { scan: Scan; right?: ReactNode }) {
  const warn = originIsWarning(scan.rulesOrigin)
  const watermark = rulesWatermark(scan.rulesOrigin)
  return (
    <div>
      <div
        className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border bg-surface px-4 py-2.5 text-sm"
        style={{ borderLeftWidth: 3, borderLeftColor: 'var(--brand)' }}
      >
        <span className="text-fg-muted">
          ScanID <code className="font-mono text-brand-emphasis" title={scan.id}>{truncId(scan.id)}</code>
        </span>
        <span className="text-fg-muted">
          rules <code className="font-mono text-brand-emphasis" title={scan.rulesVersion}>{shortRef(scan.rulesVersion)}</code>
        </span>
        <Badge tone="brand">deterministic · reproducible</Badge>
        <Badge tone={warn ? 'warning' : 'success'}>
          {warn ? '⚠ ' : '✓ '}
          {originLabel(scan.rulesOrigin)}
        </Badge>
        {scan.rulesFromCache && <Badge tone="neutral">offline · from cache</Badge>}
        {scan.rulesStale && <Badge tone="warning">rules stale</Badge>}
        {scan.rulesSchemaNewer && <Badge tone="warning">rules newer than engine</Badge>}
        {scan.rulesSkipped && scan.rulesSkipped.length > 0 && (
          <Badge tone="neutral">{scan.rulesSkipped.length} rules skipped</Badge>
        )}
        {right && <span className="ml-auto">{right}</span>}
      </div>
      {watermark && (
        <div className="mt-2 rounded-md border border-strong bg-inset px-3 py-2 text-xs text-status-warning">
          {watermark}
        </div>
      )}
    </div>
  )
}
