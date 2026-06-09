import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { findings, gate, scan, surfaces } from '@/data/loadScan'
import { repos } from '@/data/platform'
import { shortRef } from '@/lib/format'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { ScoreGauge } from '@/components/domain/ScoreGauge'
import { ProjectedScoreLadder } from '@/components/domain/ProjectedScoreLadder'
import { GateStatus } from '@/components/domain/GateStatus'
import { SurfaceList } from '@/components/domain/SurfaceList'
import { FindingTable } from '@/components/domain/FindingTable'

/** Single-repo overview. Only the real scanned repo (email-agent) shows the
 *  loaded scan; demo/unknown repos show an honest empty state rather than
 *  another repo's data. */
export function RepoOverviewPage() {
  const { repoId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const r = repos.find((x) => x.id === repoId)
  const name = r?.name ?? repoId ?? 'Repository'
  const scanned = Boolean(r && !r.demo)

  const [rescanOpen, setRescanOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={name}
        subtitle={scanned ? <>latest scan {shortRef(scan.id)}</> : undefined}
        breadcrumb={
          <>
            <Link to="/repos">Repositories</Link> / {name}
          </>
        }
        actions={
          scanned ? (
            <>
              <Button variant="secondary" onClick={() => setRescanOpen(true)}>
                Re-scan
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate(`/repos/email-agent/scans/${scan.id}`)}
              >
                View scan
              </Button>
            </>
          ) : undefined
        }
      />

      {scanned ? (
        <>
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

          <ConfirmDialog
            open={rescanOpen}
            onClose={() => setRescanOpen(false)}
            onConfirm={() => {
              toast({ title: 'Scan queued', description: `${name} will be re-scanned shortly.`, tone: 'success' })
              setRescanOpen(false)
            }}
            title={`Re-scan ${name}?`}
            message="This will queue a fresh scan of the repository."
            confirmLabel="Re-scan"
          />
        </>
      ) : (
        <EmptyState
          title="No scan loaded yet"
          description={`${name} has not been scanned by this instance.`}
          action={<Button onClick={() => navigate('/onboarding')}>Add a scan</Button>}
        />
      )}
    </div>
  )
}
