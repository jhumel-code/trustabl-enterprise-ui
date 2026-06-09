import type { ReactNode } from 'react'
import type { Finding } from '@/types'
import { SeverityBadge } from './SeverityBadge'
import { ScopeBadge } from './ScopeBadge'
import { ConfidenceMeter } from './ConfidenceMeter'
import { locationLabel } from '@/lib/format'
import { Button } from '@/components/ui/Button'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-xs uppercase tracking-wide text-fg-subtle">{label}</div>
      {children}
    </div>
  )
}

/** Full detail for one finding: explanation · suggested fix · rule provenance ·
 *  waive. Waive/assign/create-issue are platform-overlay actions (stubbed). */
export function FindingDetailPanel({ finding }: { finding: Finding }) {
  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <SeverityBadge severity={finding.severity} />
          <ScopeBadge scope={finding.scope} />
          <span className="text-xs text-fg-subtle">{finding.status}</span>
        </div>
        <h3 className="text-base font-semibold leading-snug">{finding.title}</h3>
        <div className="mt-1 font-mono text-xs text-fg-muted">{locationLabel(finding)}</div>
      </div>

      <Field label="Confidence">
        <ConfidenceMeter value={finding.confidence} />
      </Field>

      <Field label="Explanation">
        <p className="text-sm leading-relaxed text-fg">{finding.explanation}</p>
      </Field>

      {finding.suggestedFix && (
        <Field label="Suggested fix">
          <div className="rounded-md border bg-inset p-3 text-sm leading-relaxed text-fg">{finding.suggestedFix}</div>
        </Field>
      )}

      <Field label="Rule provenance">
        <div className="space-y-1 text-xs text-fg-muted">
          <div>
            rule <b className="font-mono text-fg">{finding.ruleId}</b>
          </div>
          {finding.category && (
            <div>
              pack <b className="font-mono text-fg">{finding.category}</b>
            </div>
          )}
          <a className="inline-block text-brand-emphasis" href="#rulebook">
            ↗ open rationale in rulebook
          </a>
        </div>
      </Field>

      <div className="flex flex-wrap gap-2 border-t pt-4">
        <Button variant="secondary">Waive…</Button>
        <Button variant="ghost">Assign…</Button>
        <Button variant="ghost">Create issue</Button>
      </div>
    </div>
  )
}
