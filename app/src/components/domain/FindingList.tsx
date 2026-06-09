import type { Finding } from '@/types'
import { SeverityBadge } from './SeverityBadge'
import { locationLabel, SEVERITY_ORDER } from '@/lib/format'

/** Compact, vertical finding list for narrow contexts (drawers) where the wide
 *  FindingTable would crush the title/location columns. Pass onSelect to make
 *  rows drill into the finding detail. */
export function FindingList({
  findings,
  onSelect,
}: {
  findings: Finding[]
  onSelect?: (f: Finding) => void
}) {
  const rows = [...findings].sort(
    (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity),
  )

  return (
    <ul className="divide-y">
      {rows.map((f, i) => {
        const inner = (
          <>
            <div className="pt-0.5">
              <SeverityBadge severity={f.severity} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm leading-snug text-fg">{f.title}</div>
              <div className="mt-1 break-all font-mono text-xs text-fg-muted">{locationLabel(f)}</div>
              <div className="mt-0.5 text-xs text-fg-subtle">
                {f.scope || 'meta'} · conf {f.confidence.toFixed(2)} · {f.status}
              </div>
            </div>
            {onSelect && <span className="pt-0.5 text-fg-subtle">›</span>}
          </>
        )
        return (
          <li key={i}>
            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(f)}
                className="flex w-full gap-3 py-3 text-left transition-colors hover:bg-inset"
              >
                {inner}
              </button>
            ) : (
              <div className="flex gap-3 py-3">{inner}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
