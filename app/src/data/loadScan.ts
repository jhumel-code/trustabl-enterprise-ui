import type {
  Dependency,
  Finding,
  FindingStatus,
  Gate,
  InventoryEntity,
  InventoryKind,
  InventoryTag,
  Scan,
  Scope,
  Severity,
  Skill,
  Surface,
} from '@/types'

// Multi-scan adapter: every real engine ScanResult JSON under ./scans/*.json
// (snake_case) → the camelCase view-model. Each file is one scanned repo.
// Regenerate with, for each repo:
//   trustabl scan <target> --no-rules-update --format json > app/src/data/scans/<repo>.json
//
// The engine domain is read-only; the platform overlay (Finding.status, Gate)
// is synthesized here because no control-plane backend is wired yet.

interface RawFinding {
  rule_id: string
  category: string
  scope: string
  severity: string
  tool_name: string
  file_path: string
  start_line: number
  end_line: number
  title: string
  explanation: string
  suggested_fix: string
  confidence: number
}
interface RawSurface {
  kind: string
  name: string
  file_path: string
  score: number
  finding_count: number
  weighted_severity: number
}
interface RawScan {
  scan_id: string
  repo: string
  overall_score: number
  projected_scores: { fix_critical: number; fix_high: number; fix_medium: number; fix_low: number; fix_all: number }
  languages?: string[]
  sdks?: string[]
  rules_source: string
  rules_version: string
  rules_from_cache: boolean
  rules_stale?: boolean
  rules_schema_version?: number
  rules_schema_newer?: boolean
  rules_skipped?: string[]
  rules_origin: { signed: boolean; channel?: string; custom?: boolean }
  coverage: { files_parsed: number; files_skipped: number; skipped_files?: string[] }
  findings?: RawFinding[]
  surfaces?: RawSurface[]
  tools?: RawEntity[]
  agents?: RawEntity[]
  subagents?: RawEntity[]
  skills?: RawSkill[]
  mcp_servers?: RawEntity[]
  slash_commands?: RawEntity[]
  dependencies?: RawDep[]
}
interface RawEntity {
  name?: string
  class?: string
  file_path?: string
  start_line?: number
  end_line?: number
  description?: string
  sdk?: string
  kind?: string
  language?: string
  has_typed_params?: boolean
  facts?: Record<string, unknown>
  tool_refs?: { name: string; external?: boolean }[]
  tools?: string[]
  transport?: string
}
interface RawBundled {
  path: string
  kind: string
  has_network_egress?: boolean
  reads_secrets?: boolean
  has_hardcoded_secret?: boolean
}
interface RawSkill {
  name: string
  description?: string
  allowed_tools?: string[]
  external_urls?: string[]
  bundled_files?: RawBundled[]
  file_path: string
  start_line: number
  end_line: number
}
interface RawDep {
  name: string
  version?: string
  ecosystem: string
  source: string
  start_line: number
  end_line: number
}

function basename(p: string): string {
  const parts = p.replace(/\/+$/, '').split('/')
  return parts[parts.length - 1] || p
}

// Built-in tools that meaningfully widen an agent/subagent's blast radius.
const RISKY_TOOLS = new Set(['Bash', 'Write', 'Edit', 'WebFetch'])
const truthy = (v: unknown) => v === true || v === 'true'

function grantTags(toolNames: string[]): InventoryTag[] {
  const tags: InventoryTag[] = [{ label: `${toolNames.length} tool${toolNames.length === 1 ? '' : 's'}` }]
  for (const n of toolNames) if (RISKY_TOOLS.has(n)) tags.push({ label: n, risk: true })
  return tags
}
function toolTags(e: RawEntity): InventoryTag[] {
  const tags: InventoryTag[] = []
  const f = e.facts ?? {}
  if (truthy(f.writes_fs)) tags.push({ label: 'writes FS', risk: true })
  if (truthy(f.shells_out)) tags.push({ label: 'shells out', risk: true })
  if (truthy(f.makes_network) || truthy(f.makes_http)) tags.push({ label: 'network', risk: true })
  tags.push(e.has_typed_params ? { label: 'typed params' } : { label: 'untyped params', risk: true })
  return tags
}
function skillTags(s: RawSkill): InventoryTag[] {
  const tags: InventoryTag[] = []
  if (s.allowed_tools?.length) tags.push({ label: `${s.allowed_tools.length} tools` })
  if (s.bundled_files?.length) tags.push({ label: `${s.bundled_files.length} bundled` })
  if (s.external_urls?.length)
    tags.push({ label: `${s.external_urls.length} external URL${s.external_urls.length === 1 ? '' : 's'}`, risk: true })
  return tags
}
function ent(
  kind: InventoryKind,
  e: RawEntity,
  repoId: string,
  opts: { meta?: string; tags?: InventoryTag[]; detail?: string } = {},
): InventoryEntity {
  return {
    kind,
    name: e.name ?? e.class ?? '(anonymous)',
    filePath: e.file_path ?? '',
    startLine: e.start_line ?? 0,
    endLine: e.end_line ?? 0,
    meta: opts.meta,
    tags: opts.tags,
    detail: opts.detail,
    repoId,
  }
}

// Gate is platform-derived from the engine's exit-code threshold (a finding of
// medium-or-higher fails; info/META never do), tripped by the worst such finding.
const SEV_RANK: Record<string, number> = { critical: 5, high: 4, medium: 3, low: 2, info: 1, '': 0 }
function gateFor(findings: Finding[]): Gate {
  const blocking = findings.filter((f) => SEV_RANK[f.severity] >= 3)
  if (blocking.length === 0) return { status: 'pass' }
  const worst = [...blocking].sort((a, b) => SEV_RANK[b.severity] - SEV_RANK[a.severity])[0]
  return { status: 'fail', trippedBy: `${worst.ruleId} (${worst.severity})` }
}

/** One scanned repo, fully adapted to the view-model. */
export interface RepoScan {
  repoId: string
  scan: Scan
  gate: Gate
  findings: Finding[]
  surfaces: Surface[]
  skills: Skill[]
  dependencies: Dependency[]
  inventory: Array<{ label: string; n: number }>
  inventoryEntities: InventoryEntity[]
}

function adaptScan(raw: RawScan): RepoScan {
  const repoId = basename(raw.repo)
  const scan: Scan = {
    id: raw.scan_id,
    repo: repoId,
    overallScore: raw.overall_score,
    projectedScores: {
      fixCritical: raw.projected_scores.fix_critical,
      fixHigh: raw.projected_scores.fix_high,
      fixMedium: raw.projected_scores.fix_medium,
      fixLow: raw.projected_scores.fix_low,
      fixAll: raw.projected_scores.fix_all,
    },
    languages: raw.languages ?? [],
    sdks: raw.sdks ?? [],
    rulesSource: raw.rules_source,
    rulesVersion: raw.rules_version,
    rulesFromCache: raw.rules_from_cache,
    rulesStale: raw.rules_stale,
    rulesSchemaVersion: raw.rules_schema_version,
    rulesSchemaNewer: raw.rules_schema_newer,
    rulesSkipped: raw.rules_skipped,
    rulesOrigin: raw.rules_origin,
    coverage: {
      filesParsed: raw.coverage.files_parsed,
      filesSkipped: raw.coverage.files_skipped,
      skippedFiles: raw.coverage.skipped_files,
    },
  }

  const findings: Finding[] = (raw.findings ?? []).map((f) => ({
    ruleId: f.rule_id,
    category: f.category,
    scope: f.scope as Scope,
    severity: f.severity as Severity,
    confidence: f.confidence,
    toolName: f.tool_name,
    filePath: f.file_path,
    startLine: f.start_line,
    endLine: f.end_line,
    title: f.title,
    explanation: f.explanation,
    suggestedFix: f.suggested_fix,
    repoId,
    status: 'open' as FindingStatus,
  }))

  const surfaces: Surface[] = (raw.surfaces ?? []).map((s) => ({
    kind: s.kind as Scope,
    name: s.name,
    filePath: s.file_path,
    score: s.score,
    findingCount: s.finding_count,
    weightedSeverity: s.weighted_severity,
    repoId,
  }))

  const skills: Skill[] = (raw.skills ?? []).map((s) => ({
    name: s.name,
    description: s.description ?? '',
    allowedTools: s.allowed_tools ?? [],
    externalURLs: s.external_urls ?? [],
    bundledFiles: (s.bundled_files ?? []).map((b) => ({
      path: b.path,
      kind: b.kind,
      hasNetworkEgress: b.has_network_egress,
      readsSecrets: b.reads_secrets,
      hasHardcodedSecret: b.has_hardcoded_secret,
    })),
    filePath: s.file_path,
    startLine: s.start_line,
    endLine: s.end_line,
    repoId,
  }))

  const dependencies: Dependency[] = (raw.dependencies ?? []).map((dp) => ({
    name: dp.name,
    version: dp.version ?? '',
    ecosystem: dp.ecosystem,
    source: dp.source,
    startLine: dp.start_line,
    endLine: dp.end_line,
  }))

  const inventory = [
    { label: 'Tools', n: raw.tools?.length ?? 0 },
    { label: 'Agents', n: raw.agents?.length ?? 0 },
    { label: 'Subagents', n: raw.subagents?.length ?? 0 },
    { label: 'Skills', n: raw.skills?.length ?? 0 },
    { label: 'MCP servers', n: raw.mcp_servers?.length ?? 0 },
    { label: 'Slash commands', n: raw.slash_commands?.length ?? 0 },
  ]

  const inventoryEntities: InventoryEntity[] = [
    ...(raw.tools ?? []).map((e) => ent('tool', e, repoId, { meta: e.language, tags: toolTags(e), detail: e.description })),
    ...(raw.agents ?? []).map((e) => ent('agent', e, repoId, { meta: e.sdk, tags: grantTags((e.tool_refs ?? []).map((r) => r.name)) })),
    ...(raw.subagents ?? []).map((e) => ent('subagent', e, repoId, { tags: grantTags(e.tools ?? []), detail: e.description })),
    ...(raw.skills ?? []).map((e) => ent('skill', e, repoId, { tags: skillTags(e), detail: e.description })),
    ...(raw.mcp_servers ?? []).map((e) => ent('mcp', e, repoId, { meta: e.sdk, tags: e.transport ? [{ label: `${e.transport} transport` }] : [] })),
  ]

  return { repoId, scan, gate: gateFor(findings), findings, surfaces, skills, dependencies, inventory, inventoryEntities }
}

// ── Registry ────────────────────────────────────────────────────
// Eagerly import every scan JSON; key by repo id, sorted deterministically.
const modules = import.meta.glob('./scans/*.json', { eager: true }) as Record<string, { default: RawScan }>

export const repoScans: RepoScan[] = Object.values(modules)
  .map((m) => adaptScan(m.default))
  .sort((a, b) => a.repoId.localeCompare(b.repoId))

const scansById: Record<string, RepoScan> = Object.fromEntries(repoScans.map((rs) => [rs.repoId, rs]))

/** Look up a single repo's scan bundle (per-repo detail pages). */
export function getScan(repoId: string | undefined): RepoScan | undefined {
  return repoId ? scansById[repoId] : undefined
}

// ── Aggregated fleet views (union across all scanned repos) ──────
export const findings: Finding[] = repoScans.flatMap((rs) => rs.findings)
export const surfaces: Surface[] = repoScans.flatMap((rs) => rs.surfaces)
export const skills: Skill[] = repoScans.flatMap((rs) => rs.skills)
export const inventoryEntities: InventoryEntity[] = repoScans.flatMap((rs) => rs.inventoryEntities)

/** Repo-wide dependency BOM, deduped across repos. */
export const dependencies: Dependency[] = (() => {
  const seen = new Map<string, Dependency>()
  for (const rs of repoScans)
    for (const d of rs.dependencies) {
      const key = `${d.ecosystem}:${d.name}@${d.version}`
      if (!seen.has(key)) seen.set(key, d)
    }
  return [...seen.values()]
})()

/** Inventory counts summed across the fleet. */
export const inventory: Array<{ label: string; n: number }> = [
  'Tools',
  'Agents',
  'Subagents',
  'Skills',
  'MCP servers',
  'Slash commands',
].map((label) => ({
  label,
  n: repoScans.reduce((sum, rs) => sum + (rs.inventory.find((i) => i.label === label)?.n ?? 0), 0),
}))

/** A representative scan for fleet-wide rules provenance (the rules pack is
 *  identical across repos in one run). */
export const scan: Scan = repoScans[0].scan

/** Findings attributed to a given surface entity (by name + file, scoped to its
 *  repo when known). */
export function findingsForEntity(name: string, filePath: string, repoId?: string): Finding[] {
  return findings.filter(
    (f) => f.toolName === name && f.filePath === filePath && (!repoId || f.repoId === repoId),
  )
}
