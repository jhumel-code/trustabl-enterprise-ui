import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Finding, FindingStatus } from '@/types'
import { SeverityBadge } from './SeverityBadge'
import { ScopeBadge } from './ScopeBadge'
import { ConfidenceMeter } from './ConfidenceMeter'
import { locationLabel } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { members } from '@/data/platform'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-xs uppercase tracking-wide text-fg-subtle">{label}</div>
      {children}
    </div>
  )
}

type ActiveModal = 'waive' | 'assign' | 'issue' | null

/** Full detail for one finding: explanation · suggested fix · rule provenance,
 *  with working Waive / Assign / Create-issue modal actions. Mutations are local
 *  (a waiver is a platform overlay — the scan result itself is never modified).
 *  The parent should pass a `key` per finding so this state resets on selection. */
export function FindingDetailPanel({ finding }: { finding: Finding }) {
  const [status, setStatus] = useState<FindingStatus>(finding.status)
  const [assignee, setAssignee] = useState<string | undefined>(finding.assignee)
  const [waiveReason, setWaiveReason] = useState<string | null>(null)
  const [issueKey, setIssueKey] = useState<string | null>(null)
  const [active, setActive] = useState<ActiveModal>(null)
  const close = () => setActive(null)

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <SeverityBadge severity={finding.severity} />
          <ScopeBadge scope={finding.scope} />
          <span className={status === 'waived' ? 'text-xs text-status-warning' : 'text-xs text-fg-subtle'}>{status}</span>
          {assignee && <span className="text-xs text-fg-muted">· {assignee}</span>}
        </div>
        <h3 className="text-base font-semibold leading-snug">{finding.title}</h3>
        <div className="mt-1 font-mono text-xs text-fg-muted">{locationLabel(finding)}</div>
      </div>

      {status === 'waived' && waiveReason && (
        <div className="rounded-md border border-strong bg-inset p-3 text-xs text-fg-muted">
          <span className="text-status-warning">Waived.</span> {waiveReason}
        </div>
      )}
      {issueKey && (
        <div className="rounded-md border border-strong bg-inset p-3 text-xs">
          Issue created: <span className="font-mono text-brand-emphasis">{issueKey}</span>
        </div>
      )}

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
          <a
            className="inline-block text-brand-emphasis"
            href="https://github.com/trustabl/trustabl-rulebook"
            target="_blank"
            rel="noreferrer"
          >
            ↗ open rationale in rulebook
          </a>
        </div>
      </Field>

      <div className="flex flex-wrap gap-2 border-t pt-4">
        <Button variant="secondary" disabled={status === 'waived'} onClick={() => setActive('waive')}>
          {status === 'waived' ? 'Waived' : 'Waive…'}
        </Button>
        <Button variant="ghost" onClick={() => setActive('assign')}>
          {assignee ? 'Reassign…' : 'Assign…'}
        </Button>
        <Button variant="ghost" disabled={!!issueKey} onClick={() => setActive('issue')}>
          {issueKey ? 'Issue created' : 'Create issue'}
        </Button>
      </div>

      {active === 'waive' && (
        <WaiveModal
          onClose={close}
          onWaive={(reason) => {
            setStatus('waived')
            setWaiveReason(reason)
            close()
          }}
        />
      )}
      {active === 'assign' && (
        <AssignModal
          current={assignee}
          onClose={close}
          onAssign={(who) => {
            setAssignee(who)
            close()
          }}
        />
      )}
      {active === 'issue' && (
        <IssueModal
          title={finding.title}
          onClose={close}
          onCreate={(key) => {
            setIssueKey(key)
            close()
          }}
        />
      )}
    </div>
  )
}

function WaiveModal({ onClose, onWaive }: { onClose: () => void; onWaive: (reason: string) => void }) {
  const [reason, setReason] = useState('')
  const [expiry, setExpiry] = useState('30')
  const valid = reason.trim().length > 0
  return (
    <Modal
      open
      onClose={onClose}
      title="Waive finding"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!valid}
            onClick={() => onWaive(`${reason.trim()}${expiry === '0' ? '' : ` · expires in ${expiry} days`}`)}
          >
            Waive
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <div className="mb-1 text-xs uppercase tracking-wide text-fg-subtle">Reason</div>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-strong bg-inset px-3 py-2 text-sm text-fg placeholder:text-fg-subtle"
            placeholder="Why is this finding acceptable? (required, audited)"
          />
        </div>
        <div>
          <div className="mb-1 text-xs uppercase tracking-wide text-fg-subtle">Expires in</div>
          <Select value={expiry} onChange={(e) => setExpiry(e.target.value)}>
            <option value="30">30 days</option>
            <option value="60">60 days</option>
            <option value="90">90 days</option>
            <option value="0">No expiry</option>
          </Select>
        </div>
        <p className="text-xs text-fg-subtle">
          A waiver is a platform overlay — the underlying scan result is never modified.
        </p>
      </div>
    </Modal>
  )
}

function AssignModal({
  current,
  onClose,
  onAssign,
}: {
  current?: string
  onClose: () => void
  onAssign: (who: string) => void
}) {
  const [who, setWho] = useState(current ?? members[0]?.name ?? '')
  return (
    <Modal
      open
      onClose={onClose}
      title="Assign finding"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onAssign(who)}>
            Assign
          </Button>
        </>
      }
    >
      <div>
        <div className="mb-1 text-xs uppercase tracking-wide text-fg-subtle">Assignee</div>
        <Select value={who} onChange={(e) => setWho(e.target.value)}>
          {members.map((m) => (
            <option key={m.id} value={m.name}>
              {m.name} — {m.role}
            </option>
          ))}
        </Select>
      </div>
    </Modal>
  )
}

function IssueModal({
  title,
  onClose,
  onCreate,
}: {
  title: string
  onClose: () => void
  onCreate: (key: string) => void
}) {
  const [project, setProject] = useState('TR')
  const [summary, setSummary] = useState(title)
  return (
    <Modal
      open
      onClose={onClose}
      title="Create issue"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={summary.trim() === ''} onClick={() => onCreate(`${project}-481`)}>
            Create
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <div className="mb-1 text-xs uppercase tracking-wide text-fg-subtle">Project</div>
          <Select value={project} onChange={(e) => setProject(e.target.value)}>
            <option value="TR">TR — Trustabl</option>
            <option value="SEC">SEC — Security</option>
          </Select>
        </div>
        <div>
          <div className="mb-1 text-xs uppercase tracking-wide text-fg-subtle">Summary</div>
          <Input value={summary} onChange={(e) => setSummary(e.target.value)} />
        </div>
        <p className="text-xs text-fg-subtle">Creates a tracked issue via the Jira integration.</p>
      </div>
    </Modal>
  )
}
