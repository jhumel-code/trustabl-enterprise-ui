import { useState } from 'react'
import type { Finding } from '@/types'
import { findings, gate, repo, scan, surfaces } from '@/data/loadScan'
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

/** Flagship screen — mirrors examples/scan-overview.page.yaml. */
export function ScanOverview() {
  const count = (sev: string) => findings.filter((f) => f.severity === sev).length
  const packs = [...new Set(findings.map((f) => f.category).filter(Boolean))]
  const [selected, setSelected] = useState<Finding | null>(null)

  return (
    <>
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
      {/* header — spans both columns on wide */}
      <div className="flex flex-wrap items-start justify-between gap-4 xl:col-span-2">
        <div>
          <div className="text-sm text-fg-subtle">
            Repositories / <b className="text-fg">{repo.name}</b> / Scan
          </div>
          <h1 className="mt-0.5 text-xl font-semibold">Scan overview</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost">Compare scans</Button>
          <Button variant="secondary">Export SARIF</Button>
          <Button variant="primary">Re-scan</Button>
        </div>
      </div>

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
              { id: 'inventory', label: 'Inventory', content: <InventoryTree /> },
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
      {selected && <FindingDetailPanel finding={selected} />}
    </Drawer>
    </>
  )
}
