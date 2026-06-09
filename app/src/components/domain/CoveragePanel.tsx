import type { Coverage } from '@/types'

function Metric({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div>
      <div className={tone ?? 'text-fg'}>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <div className="text-xs text-fg-muted">{label}</div>
    </div>
  )
}

/** Files parsed vs skipped — incomplete-scan honesty. */
export function CoveragePanel({ coverage }: { coverage: Coverage }) {
  const total = coverage.filesParsed + coverage.filesSkipped
  return (
    <div className="space-y-4">
      <div className="flex gap-8">
        <Metric label="Files parsed" value={coverage.filesParsed} tone="text-coverage-yes" />
        <Metric
          label="Files skipped"
          value={coverage.filesSkipped}
          tone={coverage.filesSkipped ? 'text-coverage-partial' : 'text-fg'}
        />
        <Metric label="Total" value={total} />
      </div>
      {coverage.skippedFiles && coverage.skippedFiles.length > 0 && (
        <div>
          <div className="mb-1 text-xs uppercase tracking-wide text-fg-subtle">Skipped files</div>
          <ul className="space-y-1 font-mono text-xs text-fg-muted">
            {coverage.skippedFiles.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
