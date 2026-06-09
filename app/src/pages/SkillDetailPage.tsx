import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Dependency, Skill } from '@/types'
import { dependencies, findings, skills } from '@/data/loadScan'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { DataTable } from '@/components/ui/DataTable'
import { SkillBundleView } from '@/components/domain/SkillBundleView'
import { FindingTable } from '@/components/domain/FindingTable'
import { cn } from '@/lib/cn'

const depColumns: { header: string; cell: (row: Dependency) => ReactNode; className?: string }[] = [
  { header: 'Name', cell: (d) => <span className="text-fg">{d.name}</span> },
  { header: 'Version', cell: (d) => <span className="font-mono text-xs text-fg-muted">{d.version}</span> },
  { header: 'Ecosystem', cell: (d) => <span className="text-fg-muted">{d.ecosystem}</span> },
  { header: 'Source', cell: (d) => <span className="font-mono text-xs text-fg-subtle">{d.source}</span> },
]

/** Skills browser — list-detail. SKILL.md bundle facts, content findings, and the repo BOM. */
export function SkillDetailPage() {
  const [selected, setSelected] = useState<Skill | null>(skills[0] ?? null)

  const contentFindings = selected ? findings.filter((f) => f.filePath === selected.filePath) : []

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Skills" subtitle={`${skills.length} skill${skills.length === 1 ? '' : 's'}`} />

      {skills.length === 0 ? (
        <EmptyState title="No skills discovered" />
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_1fr]">
          {/* skill list */}
          <Card className="min-w-0 p-2">
            <ul className="flex flex-col gap-1">
              {skills.map((s) => {
                const active = selected?.filePath === s.filePath && selected?.name === s.name
                return (
                  <li key={`${s.filePath}:${s.name}`}>
                    <button
                      type="button"
                      onClick={() => setSelected(s)}
                      className={cn(
                        'w-full rounded-md px-3 py-2 text-left transition-colors',
                        active ? 'bg-inset' : 'hover:bg-surface-raised',
                      )}
                    >
                      <div className="truncate text-sm font-medium text-fg">{s.name}</div>
                      <div className="truncate text-xs text-fg-subtle">{s.description}</div>
                    </button>
                  </li>
                )
              })}
            </ul>
          </Card>

          {/* detail */}
          <div className="flex min-w-0 flex-col gap-6">
            {selected && (
              <>
                <Card>
                  <SkillBundleView skill={selected} />
                </Card>

                <Card>
                  <div className="mb-3 text-sm font-semibold text-fg">
                    Content findings
                    <span className="ml-2 text-fg-subtle">{contentFindings.length}</span>
                  </div>
                  <FindingTable findings={contentFindings} />
                </Card>

                <Card>
                  <div className="mb-1 text-sm font-semibold text-fg">Dependencies (BOM)</div>
                  <p className="mb-3 text-xs text-fg-subtle">
                    Repo-wide bill of materials — {dependencies.length} package
                    {dependencies.length === 1 ? '' : 's'} across the scanned project, not scoped to this skill.
                  </p>
                  <DataTable<Dependency>
                    columns={depColumns}
                    rows={dependencies}
                    empty="No dependencies resolved."
                  />
                </Card>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
