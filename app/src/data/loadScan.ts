import type {
  Dependency,
  Finding,
  FindingStatus,
  Gate,
  InventoryEntity,
  InventoryKind,
  InventoryTag,
  Repo,
  Scan,
  Scope,
  Severity,
  Skill,
  Surface,
} from '@/types'
import raw from './scan.json'

// Adapter: real engine ScanResult JSON (snake_case) → the camelCase view-model.
// Regenerate src/data/scan.json with:
//   trustabl scan <target> --no-rules-update --format json > app/src/data/scan.json
//
// The engine domain is read-only; the platform overlay (Finding.status, Gate) is
// synthesized here because no control-plane backend is wired yet.

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
  findings: RawFinding[]
  surfaces: RawSurface[]
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

const data = raw as unknown as RawScan

function basename(p: string): string {
  const parts = p.replace(/\/+$/, '').split('/')
  return parts[parts.length - 1] || p
}

export const scan: Scan = {
  id: data.scan_id,
  repo: basename(data.repo),
  overallScore: data.overall_score,
  projectedScores: {
    fixCritical: data.projected_scores.fix_critical,
    fixHigh: data.projected_scores.fix_high,
    fixMedium: data.projected_scores.fix_medium,
    fixLow: data.projected_scores.fix_low,
    fixAll: data.projected_scores.fix_all,
  },
  languages: data.languages ?? [],
  sdks: data.sdks ?? [],
  rulesSource: data.rules_source,
  rulesVersion: data.rules_version,
  rulesFromCache: data.rules_from_cache,
  rulesStale: data.rules_stale,
  rulesSchemaVersion: data.rules_schema_version,
  rulesSchemaNewer: data.rules_schema_newer,
  rulesSkipped: data.rules_skipped,
  rulesOrigin: data.rules_origin,
  coverage: {
    filesParsed: data.coverage.files_parsed,
    filesSkipped: data.coverage.files_skipped,
    skippedFiles: data.coverage.skipped_files,
  },
}

export const findings: Finding[] = data.findings.map((f) => ({
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
  status: 'open' as FindingStatus, // platform overlay — fresh scan has no waivers
}))

export const surfaces: Surface[] = data.surfaces.map((s) => ({
  kind: s.kind as Scope,
  name: s.name,
  filePath: s.file_path,
  score: s.score,
  findingCount: s.finding_count,
  weightedSeverity: s.weighted_severity,
}))

export const repo: Repo = {
  id: basename(data.repo),
  name: basename(data.repo),
  latestScanId: data.scan_id,
}

export const inventory: Array<{ label: string; n: number }> = [
  { label: 'Tools', n: data.tools?.length ?? 0 },
  { label: 'Agents', n: data.agents?.length ?? 0 },
  { label: 'Subagents', n: data.subagents?.length ?? 0 },
  { label: 'Skills', n: data.skills?.length ?? 0 },
  { label: 'MCP servers', n: data.mcp_servers?.length ?? 0 },
  { label: 'Slash commands', n: data.slash_commands?.length ?? 0 },
]

export const skills: Skill[] = (data.skills ?? []).map((s) => ({
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
}))

export const dependencies: Dependency[] = (data.dependencies ?? []).map((dp) => ({
  name: dp.name,
  version: dp.version ?? '',
  ecosystem: dp.ecosystem,
  source: dp.source,
  startLine: dp.start_line,
  endLine: dp.end_line,
}))

// Built-in tools that meaningfully widen an agent/subagent's blast radius.
const RISKY_TOOLS = new Set(['Bash', 'Write', 'Edit', 'WebFetch'])
const truthy = (v: unknown) => v === true || v === 'true'

/** Tool/agent grant chips: a count plus a risk chip per dangerous built-in. */
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

interface NamedEntity {
  name?: string
  class?: string
  file_path?: string
  start_line?: number
  end_line?: number
}

function ent(
  kind: InventoryKind,
  e: NamedEntity,
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
  }
}

export const inventoryEntities: InventoryEntity[] = [
  ...(data.tools ?? []).map((e) => ent('tool', e, { meta: e.language, tags: toolTags(e), detail: e.description })),
  ...(data.agents ?? []).map((e) =>
    ent('agent', e, { meta: e.sdk, tags: grantTags((e.tool_refs ?? []).map((r) => r.name)) }),
  ),
  ...(data.subagents ?? []).map((e) =>
    ent('subagent', e, { tags: grantTags(e.tools ?? []), detail: e.description }),
  ),
  ...(data.skills ?? []).map((e) => ent('skill', e, { tags: skillTags(e), detail: e.description })),
  ...(data.mcp_servers ?? []).map((e) =>
    ent('mcp', e, { meta: e.sdk, tags: e.transport ? [{ label: `${e.transport} transport` }] : [] }),
  ),
]

/** Findings whose surface identity matches a given entity (by file + name). */
export function findingsForEntity(name: string, filePath: string): Finding[] {
  return findings.filter((f) => f.toolName === name && f.filePath === filePath)
}

// Gate is platform-derived from the engine's exit-code threshold (a finding of
// medium-or-higher fails; info/META never do), tripped by the worst such finding.
const SEV_RANK: Record<string, number> = { critical: 5, high: 4, medium: 3, low: 2, info: 1, '': 0 }
export const gate: Gate = (() => {
  const blocking = findings.filter((f) => SEV_RANK[f.severity] >= 3)
  if (blocking.length === 0) return { status: 'pass' }
  const worst = [...blocking].sort((a, b) => SEV_RANK[b.severity] - SEV_RANK[a.severity])[0]
  return { status: 'fail', trippedBy: `${worst.ruleId} (${worst.severity})` }
})()
