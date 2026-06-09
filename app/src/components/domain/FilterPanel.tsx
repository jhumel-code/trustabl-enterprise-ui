import type { Finding, Surface } from '@/types'
import { SEVERITY_ORDER } from '@/lib/format'

function tally(items: string[]): string {
  const m = new Map<string, number>()
  for (const it of items) m.set(it, (m.get(it) ?? 0) + 1)
  return [...m.entries()].map(([k, n]) => `${k} ${n}`).join(' · ')
}

/** Read-only facet summary (counts) over the current findings. Wire onChange
 *  handlers here when filtering goes live. */
export function FilterPanel({ findings, surfaces }: { findings: Finding[]; surfaces: Surface[] }) {
  const severity = SEVERITY_ORDER.filter((s) => findings.some((f) => f.severity === s))
    .map((s) => `${s} ${findings.filter((f) => f.severity === s).length}`)
    .join(' · ')
  const rows: Array<[string, string]> = [
    ['Severity', severity],
    ['Scope', tally(findings.map((f) => (f.scope === '' ? 'meta' : f.scope)))],
    ['Category', tally(findings.map((f) => f.category))],
    ['Surface', `${surfaces.length} surfaces`],
    ['Status', tally(findings.map((f) => f.status))],
  ]
  return (
    <div className="rounded-lg border bg-surface p-4">
      <h4 className="mb-3 text-xs uppercase tracking-wide text-fg-subtle">Filter</h4>
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-3 py-1.5 text-sm text-fg-muted">
          <span>{k}</span>
          <span className="text-right">{v}</span>
        </div>
      ))}
    </div>
  )
}
