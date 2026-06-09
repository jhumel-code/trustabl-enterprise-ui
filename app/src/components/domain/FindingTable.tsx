import type { Finding } from '@/types'
import { SeverityBadge } from './SeverityBadge'
import { ScopeBadge } from './ScopeBadge'
import { locationLabel, SEVERITY_ORDER } from '@/lib/format'
import { cn } from '@/lib/cn'

const HEADERS = ['Sev', 'Finding', 'Scope', 'Location', 'Conf.', 'Status']

export function FindingTable({
  findings,
  onSelect,
  selected,
}: {
  findings: Finding[]
  onSelect?: (f: Finding) => void
  selected?: Finding | null
}) {
  const rows = [...findings].sort(
    (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity),
  )
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          {HEADERS.map((h) => (
            <th
              key={h}
              className="border-b px-2.5 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-fg-subtle"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((f, i) => (
          <tr
            key={i}
            onClick={() => onSelect?.(f)}
            className={cn(
              'border-b last:border-0',
              onSelect && 'cursor-pointer hover:bg-inset',
              selected === f && 'bg-inset',
            )}
          >
            <td className="px-2.5 py-2.5">
              <SeverityBadge severity={f.severity} />
            </td>
            <td className="px-2.5 py-2.5">{f.title}</td>
            <td className="px-2.5 py-2.5">
              <ScopeBadge scope={f.scope} />
            </td>
            <td className="px-2.5 py-2.5 font-mono text-xs text-fg-muted">{locationLabel(f)}</td>
            <td className="px-2.5 py-2.5">{f.confidence.toFixed(2)}</td>
            <td className="px-2.5 py-2.5">
              {f.status === 'waived' ? <span className="text-fg-subtle">waived</span> : f.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
