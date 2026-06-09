import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Finding, Severity } from '@/types'
import { findings, surfaces } from '@/data/loadScan'
import { SEVERITY_ORDER } from '@/lib/format'
import { cn } from '@/lib/cn'
import { FindingTable } from '@/components/domain/FindingTable'
import { FindingDetailPanel } from '@/components/domain/FindingDetailPanel'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Drawer } from '@/components/ui/Drawer'
import { EmptyState } from '@/components/ui/EmptyState'

const SEV_DOT: Record<Severity, string> = {
  critical: 'bg-severity-critical',
  high: 'bg-severity-high',
  medium: 'bg-severity-medium',
  low: 'bg-severity-low',
  info: 'bg-severity-info',
}

type Sort = 'severity' | 'confidence' | 'location'

const scopeKey = (f: Finding) => (f.scope === '' ? 'meta' : f.scope)
const sevCount = (s: Severity) => findings.filter((f) => f.severity === s).length
const scopeOptions = [...new Set(findings.map(scopeKey))].sort()
const statusOptions = [...new Set(findings.map((f) => f.status))].sort()
const repoOptions = [...new Set(findings.map((f) => f.repoId).filter(Boolean) as string[])].sort()

/** Findings browser — search, facet filters, sort, full-width table; the detail
 *  opens in a slide-over drawer (matching the Scan-overview finding interaction). */
export function FindingsPage() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [sevSel, setSevSel] = useState<Set<Severity>>(new Set())
  const [scope, setScope] = useState('all')
  const [status, setStatus] = useState('all')
  const [repoSel, setRepoSel] = useState('all')
  const [sort, setSort] = useState<Sort>('severity')
  const [selected, setSelected] = useState<Finding | null>(null)

  const active =
    sevSel.size > 0 || scope !== 'all' || status !== 'all' || repoSel !== 'all' || query.trim() !== ''

  function toggleSev(s: Severity) {
    setSevSel((prev) => {
      const next = new Set(prev)
      next.has(s) ? next.delete(s) : next.add(s)
      return next
    })
  }
  function clearAll() {
    setQuery('')
    setSevSel(new Set())
    setScope('all')
    setStatus('all')
    setRepoSel('all')
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const out = findings.filter((f) => {
      if (sevSel.size && !sevSel.has(f.severity)) return false
      if (scope !== 'all' && scopeKey(f) !== scope) return false
      if (status !== 'all' && f.status !== status) return false
      if (repoSel !== 'all' && f.repoId !== repoSel) return false
      if (q) {
        const hay = `${f.title} ${f.ruleId} ${f.filePath} ${f.toolName} ${f.category} ${f.explanation}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    return out.sort((a, b) => {
      if (sort === 'confidence') return b.confidence - a.confidence
      if (sort === 'location') return a.filePath.localeCompare(b.filePath) || a.startLine - b.startLine
      return SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
    })
  }, [query, sevSel, scope, status, repoSel, sort])

  return (
    <>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Findings"
          subtitle={`${findings.length} findings across ${repoOptions.length} ${repoOptions.length === 1 ? 'repository' : 'repositories'} · ${surfaces.length} surfaces`}
        />

        {/* severity summary — also filters */}
        <div className="flex flex-wrap gap-2">
          {SEVERITY_ORDER.map((s) => {
            const on = sevSel.has(s)
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleSev(s)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm capitalize',
                  on ? 'border-brand bg-inset text-fg' : 'border-strong text-fg-muted hover:text-fg',
                )}
              >
                <span className={cn('h-2 w-2 rounded-full', SEV_DOT[s])} />
                {s}
                <span className="font-mono text-fg-subtle">{sevCount(s)}</span>
              </button>
            )
          })}
        </div>

        {/* toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search title, rule, file…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="w-44">
            <Select value={repoSel} onChange={(e) => setRepoSel(e.target.value)}>
              <option value="all">All repositories</option>
              {repoOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </div>
          <div className="w-32">
            <Select value={scope} onChange={(e) => setScope(e.target.value)}>
              <option value="all">All scopes</option>
              {scopeOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
          <div className="w-32">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All statuses</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
          <div className="w-40">
            <Select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="severity">Sort: severity</option>
              <option value="confidence">Sort: confidence</option>
              <option value="location">Sort: location</option>
            </Select>
          </div>
          <span className="ml-auto text-xs text-fg-muted">
            {filtered.length} of {findings.length}
          </span>
          {active && (
            <Button size="sm" variant="ghost" onClick={clearAll}>
              Clear
            </Button>
          )}
        </div>

        {filtered.length > 0 ? (
          <Card className="p-0">
            <div className="overflow-auto p-2">
              <FindingTable findings={filtered} sort="none" showRepo onSelect={setSelected} selected={selected} />
            </div>
          </Card>
        ) : (
          <EmptyState
            title="No findings match"
            description="Adjust the filters or clear them to see all findings."
            action={
              <Button size="sm" variant="secondary" onClick={clearAll}>
                Clear filters
              </Button>
            }
          />
        )}
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Finding">
        {selected && (
          <FindingDetailPanel
            key={`${selected.ruleId}:${selected.filePath}:${selected.startLine}`}
            finding={selected}
          />
        )}
      </Drawer>
    </>
  )
}
