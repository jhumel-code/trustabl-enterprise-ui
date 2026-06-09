import { useState } from 'react'
import type { Finding } from '@/types'
import { findings, repo, surfaces } from '@/data/loadScan'
import { FindingTable } from '@/components/domain/FindingTable'
import { FilterPanel } from '@/components/domain/FilterPanel'
import { FindingDetailPanel } from '@/components/domain/FindingDetailPanel'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'

/** Findings browser — list-detail. Cross-repo in the spec; today it shows the
 *  one loaded scan's findings. */
export function FindingsPage() {
  const [selected, setSelected] = useState<Finding | null>(findings[0] ?? null)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Findings"
        subtitle={`${findings.length} findings in ${repo.name} · ${surfaces.length} surfaces`}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="min-w-0">
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
              <EmptyState
                title="No finding selected"
                description="Pick a finding from the table to see its detail."
              />
            )}
          </Card>
        </aside>
      </div>
    </div>
  )
}
