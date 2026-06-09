import type { Scan } from '@/types'
import { originLabel, shortRef, sourceLabel } from '@/lib/format'

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="text-xs text-fg-muted">
      {k} <b className="font-mono text-fg">{v}</b>
    </div>
  )
}

export function RuleProvenanceCard({ scan, packs }: { scan: Scan; packs: string[] }) {
  return (
    <div className="rounded-lg border bg-surface p-4">
      <h4 className="mb-3 text-xs uppercase tracking-wide text-fg-subtle">Rule provenance</h4>
      <div className="space-y-1">
        <KV k="source" v={sourceLabel(scan.rulesSource)} />
        <KV k="version" v={shortRef(scan.rulesVersion)} />
        <KV k="origin" v={originLabel(scan.rulesOrigin)} />
        <KV k="packs" v={packs.join(', ')} />
      </div>
      <a
        className="mt-2 inline-block text-xs text-brand-emphasis"
        href="https://github.com/trustabl/trustabl-rulebook"
        target="_blank"
        rel="noreferrer"
      >
        ↗ open rationale in rulebook
      </a>
    </div>
  )
}
