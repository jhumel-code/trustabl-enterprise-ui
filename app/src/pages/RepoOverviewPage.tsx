import { useParams } from 'react-router-dom'
import { findings, gate, repo, scan, surfaces } from '@/data/loadScan'
import { shortRef } from '@/lib/format'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ScoreGauge } from '@/components/domain/ScoreGauge'
import { ProjectedScoreLadder } from '@/components/domain/ProjectedScoreLadder'
import { GateStatus } from '@/components/domain/GateStatus'
import { SurfaceList } from '@/components/domain/SurfaceList'
import { FindingTable } from '@/components/domain/FindingTable'

/** Single-repo overview for the loaded scan — score, readiness, gate, then
 *  surfaces and findings for the one repo named by the route. */
export function RepoOverviewPage() {
  const { repoId } = useParams()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={repoId ?? repo.name}
        subtitle={<>latest scan {shortRef(scan.id)}</>}
        actions={<Button variant="primary">Re-scan</Button>}
      />

      <Card className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <ScoreGauge value={scan.overallScore} />
          <div>
            <div className="mb-1 text-xs uppercase tracking-wide text-fg-subtle">Overall score</div>
            <div className="text-sm text-fg-muted">
              {findings.length} findings · {surfaces.length} surfaces
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-1.5 text-xs uppercase tracking-wide text-fg-subtle">Readiness</div>
          <ProjectedScoreLadder value={scan.projectedScores} />
        </div>

        <GateStatus gate={gate} />
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-fg">Surfaces</h2>
        <SurfaceList surfaces={surfaces} />
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-fg">Findings</h2>
        <FindingTable findings={findings} />
      </Card>
    </div>
  )
}
