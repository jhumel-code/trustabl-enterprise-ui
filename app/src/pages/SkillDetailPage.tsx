import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Dependency, Finding, Skill } from '@/types'
import { dependencies, findings, skills } from '@/data/loadScan'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { TableCard } from '@/components/ui/TableCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { DataTable } from '@/components/ui/DataTable'
import { Drawer } from '@/components/ui/Drawer'
import { SkillBundleView } from '@/components/domain/SkillBundleView'
import { FindingList } from '@/components/domain/FindingList'
import { FindingDetailPanel } from '@/components/domain/FindingDetailPanel'

const depColumns: { header: string; cell: (row: Dependency) => ReactNode; className?: string }[] = [
  { header: 'Name', cell: (d) => <span className="text-fg">{d.name}</span> },
  { header: 'Version', cell: (d) => <span className="font-mono text-xs text-fg-muted">{d.version}</span> },
  { header: 'Ecosystem', cell: (d) => <span className="text-fg-muted">{d.ecosystem}</span> },
  { header: 'Source', cell: (d) => <span className="font-mono text-xs text-fg-subtle">{d.source}</span> },
]

/** Skills browser — full-width list; the skill bundle + content findings open in a
 *  drawer. The repo-wide dependency BOM is a separate card (not skill-scoped). */
export function SkillDetailPage() {
  const [selected, setSelected] = useState<Skill | null>(null)
  const [finding, setFinding] = useState<Finding | null>(null)
  const contentFindings = selected ? findings.filter((f) => f.filePath === selected.filePath) : []

  const skillColumns: { header: string; cell: (s: Skill) => ReactNode; className?: string }[] = [
    { header: 'Skill', cell: (s) => <span className="font-medium">{s.name}</span> },
    { header: 'Description', cell: (s) => <span className="text-fg-muted">{s.description}</span> },
    { header: 'Tools', cell: (s) => s.allowedTools.length, className: 'text-right tabular-nums' },
    { header: 'Bundled', cell: (s) => s.bundledFiles.length, className: 'text-right tabular-nums' },
  ]

  return (
    <>
      <div className="flex flex-col gap-6">
        <PageHeader title="Skills" subtitle={`${skills.length} skill${skills.length === 1 ? '' : 's'}`} />

        {skills.length === 0 ? (
          <EmptyState title="No skills discovered" description="This scan found no skills." />
        ) : (
          <TableCard title="Skills" count={`${skills.length}`}>
            <DataTable<Skill>
              columns={skillColumns}
              rows={skills}
              onRowClick={setSelected}
              empty="No skills discovered."
            />
          </TableCard>
        )}

        <Card>
          <div className="mb-1 text-sm font-semibold text-fg">Dependencies (BOM)</div>
          <p className="mb-3 text-xs text-fg-subtle">
            Repo-wide bill of materials — {dependencies.length} package
            {dependencies.length === 1 ? '' : 's'} across the scanned project, not scoped to a skill.
          </p>
          <div className="overflow-auto">
            <DataTable<Dependency> columns={depColumns} rows={dependencies} empty="No dependencies resolved." />
          </div>
        </Card>
      </div>

      <Drawer
        open={!!selected}
        onClose={() => {
          setSelected(null)
          setFinding(null)
        }}
        title={finding ? 'Finding' : 'Skill'}
      >
        {finding ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setFinding(null)}
              className="text-sm text-brand-emphasis hover:underline"
            >
              ← Back to skill
            </button>
            <FindingDetailPanel
              key={`${finding.ruleId}:${finding.filePath}:${finding.startLine}`}
              finding={finding}
            />
          </div>
        ) : selected ? (
          <div className="space-y-5">
            <SkillBundleView skill={selected} />
            <div>
              <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
                Content findings · {contentFindings.length}
              </div>
              {contentFindings.length > 0 ? (
                <FindingList findings={contentFindings} onSelect={setFinding} />
              ) : (
                <div className="py-2 text-sm text-fg-muted">No content findings for this skill.</div>
              )}
            </div>
          </div>
        ) : null}
      </Drawer>
    </>
  )
}
