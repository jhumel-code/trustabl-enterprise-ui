import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { pct } from '@/lib/format'
import { repos, rulePacks } from '@/data/platform'
import { findings, skills, surfaces } from '@/data/loadScan'

interface Hit {
  group: string
  label: string
  sub?: string
  route: string
  hay: string
}

// Flat search index over everything the topbar promises ("repos · findings ·
// rules") plus the scan surfaces/skills. Built once from static in-memory data;
// swap for a server-backed query when the control-plane API lands.
const INDEX: Hit[] = [
  ...repos.map((r) => ({
    group: 'Repository',
    label: r.name,
    sub: `${pct(r.score)} readiness`,
    route: `/repos/${r.id}`,
    hay: r.name.toLowerCase(),
  })),
  ...findings.map((f) => ({
    group: 'Finding',
    label: f.title,
    sub: `${f.ruleId} · ${f.severity}`,
    route: `/findings?q=${encodeURIComponent(f.ruleId)}`,
    hay: `${f.title} ${f.ruleId} ${f.filePath} ${f.toolName}`.toLowerCase(),
  })),
  ...rulePacks.map((p) => ({
    group: 'Rule pack',
    label: p.name,
    sub: `${p.rules} rules`,
    route: '/settings/rules',
    hay: `${p.name} ${p.category} ${p.id}`.toLowerCase(),
  })),
  ...surfaces
    .filter((s) => s.name)
    .map((s) => ({
      group: 'Surface',
      label: s.name,
      sub: s.kind,
      route: `/surfaces/${encodeURIComponent(s.name)}`,
      hay: `${s.name} ${s.filePath} ${s.kind}`.toLowerCase(),
    })),
  ...skills.map((s) => ({
    group: 'Skill',
    label: s.name,
    sub: 'skill',
    route: `/skills/${encodeURIComponent(s.name)}`,
    hay: `${s.name} ${s.description}`.toLowerCase(),
  })),
]

const MAX_RESULTS = 8

/** Functional global search: filters the in-memory index across repos, findings,
 *  rules, surfaces, and skills; results open in a dropdown with full keyboard
 *  navigation (↑/↓/Enter/Esc) and click-to-jump. */
export function GlobalSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return [] as Hit[]
    return INDEX.filter((h) => h.hay.includes(q))
      .sort(
        (a, b) =>
          (a.label.toLowerCase().startsWith(q) ? 0 : 1) - (b.label.toLowerCase().startsWith(q) ? 0 : 1),
      )
      .slice(0, MAX_RESULTS)
  }, [query])

  useEffect(() => setActive(0), [query])

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  function go(hit: Hit) {
    setQuery('')
    setOpen(false)
    navigate(hit.route)
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setOpen(false)
      return
    }
    if (!results.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(results[active])
    }
  }

  const showDropdown = open && query.trim().length > 0

  return (
    <div ref={rootRef} className="relative hidden max-w-[520px] flex-1 sm:block">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls="global-search-results"
        placeholder="Search repos · findings · rules…"
        className="w-full rounded-md border border-strong bg-inset px-2.5 py-1.5 text-sm text-fg placeholder:text-fg-subtle focus:border-brand focus:outline-none"
      />
      {showDropdown && (
        <div
          id="global-search-results"
          role="listbox"
          className="absolute left-0 right-0 top-full z-[100] mt-1 max-h-80 overflow-auto rounded-md border border-strong bg-surface-raised py-1 shadow-lg"
        >
          {results.length === 0 ? (
            <div className="px-3 py-3 text-sm text-fg-muted">No matches for “{query.trim()}”</div>
          ) : (
            results.map((h, i) => (
              <button
                key={`${h.group}:${h.route}:${i}`}
                type="button"
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(h)}
                className={cn(
                  'flex w-full items-center gap-3 px-3 py-2 text-left',
                  i === active ? 'bg-inset' : '',
                )}
              >
                <span className="w-[68px] shrink-0 text-[10px] font-medium uppercase tracking-wide text-fg-subtle">
                  {h.group}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-fg">{h.label}</span>
                {h.sub && <span className="shrink-0 truncate text-xs text-fg-muted">{h.sub}</span>}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
