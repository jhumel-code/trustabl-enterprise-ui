import { useState } from 'react'
import type { Finding } from '@/types'
import { findings, repo, surfaces } from '@/data/loadScan'
import { FindingTable } from '@/components/domain/FindingTable'
import { FilterPanel } from '@/components/domain/FilterPanel'
import { FindingDetailPanel } from '@/components/domain/FindingDetailPanel'
import { Card } from '@/components/ui/Card'

/** Findings browser — list-detail. Cross-repo in the spec; today it shows the
 *  one loaded scan's findings. */
export function FindingsPage() {
  const [selected, setSelected] = useState<Finding | null>(findings[0] ?? null)

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold">Findings</h1>
        <p className="mb-4 mt-0.5 text-sm text-fg-muted">
          {findings.length} findings in <b className="text-fg">{repo.name}</b> · {surfaces.length} surfaces
        </p>
        <Card className="p-0">
          <div className="overflow-auto p-2">
            <FindingTable findings={findings} onSelect={setSelected} selected={selected} />
          </div>
        </Card>
      </div>

      <aside className="flex flex-col gap-6">
        <FilterPanel findings={findings} surfaces={surfaces} />
        <Card>
          {selected ? (
            <FindingDetailPanel
              key={`${selected.ruleId}:${selected.filePath}:${selected.startLine}`}
              finding={selected}
            />
          ) : (
            <div className="text-sm text-fg-muted">Select a finding to see its detail.</div>
          )}
        </Card>
      </aside>
    </div>
  )
}
