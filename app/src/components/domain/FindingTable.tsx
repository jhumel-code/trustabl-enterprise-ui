import type { Finding } from '@/types'
import { SeverityBadge } from './SeverityBadge'
import { ScopeBadge } from './ScopeBadge'
import { locationLabel, SEVERITY_ORDER } from '@/lib/format'
import { cn } from '@/lib/cn'

const HEADERS: Array<{ label: string; className?: string }> = [
  { label: 'Sev' },
  { label: 'Finding' },
  { label: 'Scope' },
  { label: 'Location' },
  { label: 'Conf.', className: 'text-right' },
  { label: 'Status' },
]

export function FindingTable({
  findings,
  onSelect,
  selected,
  sort = 'severity',
}: {
  findings: Finding[]
  onSelect?: (f: Finding) => void
  selected?: Finding | null
  sort?: 'severity' | 'none'
}) {
  const rows =
    sort === 'none'
      ? findings
      : [...findings].sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity))
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          {HEADERS.map((h) => (
            <th
              key={h.label}
              className={cn(
                'border-b px-2.5 py-2 text-left align-bottom text-[11px] font-medium uppercase tracking-wide text-fg-subtle',
                h.className,
              )}
            >
              {h.label}
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
            <td className="whitespace-nowrap px-2.5 py-2.5 align-top">
              <SeverityBadge severity={f.severity} />
            </td>
            <td className="w-full px-2.5 py-2.5 align-top">{f.title}</td>
            <td className="whitespace-nowrap px-2.5 py-2.5 align-top">
              <ScopeBadge scope={f.scope} />
            </td>
            <td className="px-2.5 py-2.5 align-top font-mono text-xs text-fg-muted">{locationLabel(f)}</td>
            <td className="whitespace-nowrap px-2.5 py-2.5 text-right align-top tabular-nums">
              {f.confidence.toFixed(2)}
            </td>
            <td className="whitespace-nowrap px-2.5 py-2.5 align-top">
              {f.status === 'waived' ? <span className="text-fg-subtle">waived</span> : f.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
