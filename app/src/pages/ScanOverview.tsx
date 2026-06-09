import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Finding } from '@/types'
import { getScan } from '@/data/loadScan'
import { EmptyState } from '@/components/ui/EmptyState'
import { Drawer } from '@/components/ui/Drawer'
import { FindingDetailPanel } from '@/components/domain/FindingDetailPanel'
import { ScanProvenanceBar } from '@/components/domain/ScanProvenanceBar'
import { GateStatus } from '@/components/domain/GateStatus'
import { ScoreGauge } from '@/components/domain/ScoreGauge'
import { ProjectedScoreLadder } from '@/components/domain/ProjectedScoreLadder'
import { FindingTable } from '@/components/domain/FindingTable'
import { SurfaceList } from '@/components/domain/SurfaceList'
import { InventoryTree } from '@/components/domain/InventoryTree'
import { CoveragePanel } from '@/components/domain/CoveragePanel'
import { FilterPanel } from '@/components/domain/FilterPanel'
import { RuleProvenanceCard } from '@/components/domain/RuleProvenanceCard'
import { Stat } from '@/components/ui/Stat'
import { Tabs } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

/** Flagship screen — mirrors examples/scan-overview.page.yaml. */
export function ScanOverview() {
  const navigate = useNavigate()
  const { repoId } = useParams()
  const repoScan = getScan(repoId)
  const [selected, setSelected] = useState<Finding | null>(null)
  const [rescanOpen, setRescanOpen] = useState(false)

  if (!repoScan) {
    return (
      <EmptyState
        title="Scan not found"
        description="This repository has no loaded scan in this instance."
      />
    )
  }

  const { scan, gate, findings, surfaces, inventory } = repoScan
  const count = (sev: string) => findings.filter((f) => f.severity === sev).length
  const packs = [...new Set(findings.map((f) => f.category).filter(Boolean))]

  return (
    <>
    <PageHeader
      title="Scan overview"
      breadcrumb={<>Repositories / <b className="text-fg">{scan.repo}</b> / Scan</>}
      actions={
        <>
          <Button
            variant="ghost"
            onClick={() => navigate(`/repos/${repoScan.repoId}/scans/${scan.id}/diff/${scan.id}`)}
          >
            Compare scans
          </Button>
          <Button
            variant="secondary"
            disabled
            title="SARIF is produced by the engine: trustabl scan --format sarif"
          >
            Export SARIF
          </Button>
          <Button variant="primary" onClick={() => setRescanOpen(true)}>
            Re-scan
          </Button>
        </>
      }
    />
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
      {/* provenance bar — spans both columns on wide */}
      <div className="xl:col-span-2">
        <ScanProvenanceBar scan={scan} right={<GateStatus gate={gate} />} />
      </div>

      {/* left column */}
      <div className="flex min-w-0 flex-col gap-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <Card className="col-span-2 flex items-center gap-4">
            <ScoreGauge value={scan.overallScore} />
            <div>
              <div className="mb-1 text-xs text-fg-muted">Readiness</div>
              <ProjectedScoreLadder value={scan.projectedScores} />
            </div>
          </Card>
          <Stat label="Critical" value={count('critical')} dotClass="bg-severity-critical" />
          <Stat label="High" value={count('high')} dotClass="bg-severity-high" />
          <Stat label="Medium" value={count('medium')} dotClass="bg-severity-medium" />
        </div>

        <Card>
          <Tabs
            items={[
              {
                id: 'findings',
                label: 'Findings',
                count: findings.length,
                content: <FindingTable findings={findings} onSelect={setSelected} selected={selected} />,
              },
              {
                id: 'surfaces',
                label: 'Surfaces',
                count: surfaces.length,
                content: <SurfaceList surfaces={surfaces} />,
              },
              { id: 'inventory', label: 'Inventory', content: <InventoryTree inventory={inventory} /> },
              { id: 'coverage', label: 'Coverage', content: <CoveragePanel coverage={scan.coverage} /> },
            ]}
          />
        </Card>
      </div>

      {/* right rail */}
      <aside className="flex flex-col gap-6">
        <FilterPanel findings={findings} surfaces={surfaces} />
        <RuleProvenanceCard scan={scan} packs={packs} />
      </aside>
    </div>

    <Drawer open={!!selected} onClose={() => setSelected(null)} title="Finding">
      {selected && (
        <FindingDetailPanel
          key={`${selected.ruleId}:${selected.filePath}:${selected.startLine}`}
          finding={selected}
        />
      )}
    </Drawer>

    <ConfirmDialog
      open={rescanOpen}
      onClose={() => setRescanOpen(false)}
      onConfirm={() => setRescanOpen(false)}
      title="Re-scan this repo?"
      message="This will queue a fresh scan of the repository against the current rule packs."
      confirmLabel="Re-scan"
    />
    </>
  )
}
