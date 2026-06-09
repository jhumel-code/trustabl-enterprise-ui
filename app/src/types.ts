// View-model types for the Trustabl Enterprise control plane.
// camelCase mirrors the engine's snake_case `json:` tags 1:1 (see ../../data-model.md).
//
// Two domains:
//  - engine  : read-only, deterministic — produced by `scanner.Run`, immutable per ScanID.
//  - platform: mutable control-plane overlay (Gate, Waiver, Repo, ...).

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info'

/** Finding.scope is one of the five scopes, or '' for META findings. */
export type Scope = 'tool' | 'agent' | 'subagent' | 'skill' | 'repo' | ''

/** Platform overlay — never an engine field. */
export type FindingStatus = 'open' | 'waived' | 'fixed'

// ── Engine domain ───────────────────────────────────────────────

export interface RulesOrigin {
  signed: boolean
  channel?: string
  custom?: boolean
}

export interface ProjectedScores {
  fixCritical: number
  fixHigh: number
  fixMedium: number
  fixLow: number
  fixAll: number
}

export interface Coverage {
  filesParsed: number
  filesSkipped: number
  skippedFiles?: string[]
}

export interface Scan {
  id: string
  repo: string // label string, NOT an id
  overallScore: number // float64 in [0,1]
  projectedScores: ProjectedScores // each 0..1; engine estimate — never recompute
  languages: string[]
  sdks: string[]
  // Rules provenance — the trust wedge.
  rulesSource: string
  rulesVersion: string // commit SHA or bundle digest — never semver
  rulesFromCache: boolean
  rulesStale?: boolean
  rulesSchemaVersion?: number
  rulesSchemaNewer?: boolean
  rulesSkipped?: string[]
  rulesOrigin: RulesOrigin
  vulnerabilities?: Vulnerability[] // only under --vuln-scan
  coverage: Coverage
}

export interface Finding {
  ruleId: string
  category: string
  scope: Scope
  severity: Severity
  confidence: number // 0..1
  toolName: string
  filePath: string
  startLine: number // inclusive 1-indexed range; both 0 for repo-scope
  endLine: number
  title: string
  explanation: string
  suggestedFix: string
  // ── platform overlay (joined at read time) ──
  status: FindingStatus
  waiverId?: string
  assignee?: string
  firstSeenScanId?: string
}

export interface Surface {
  kind: Scope // tool | agent | subagent | skill | repo
  name: string // '' for the repo surface
  filePath: string
  score: number // 0..1
  findingCount: number
  weightedSeverity: number
}

export interface Dependency {
  name: string
  version: string // declared spec verbatim (pin | range | empty), NOT resolved
  ecosystem: string
  source: string
  startLine: number
  endLine: number
}

export interface Vulnerability {
  dep: Dependency
  id: string // primary OSV id (GHSA-/PYSEC-/CVE-)
  aliases?: string[]
  summary?: string
  severity: Severity
  fixedIn?: string
}

export interface RulePack {
  id: string
  name: string
  category: string
  version: string // commit SHA (git) or bundle digest (signed) — never semver
}

// ── Platform domain ─────────────────────────────────────────────

export type GateState = 'pass' | 'fail'

export interface Gate {
  status: GateState // derived from the --strict exit-code threshold
  trippedBy?: string
}

export interface Repo {
  id: string
  name: string
  scm?: string
  url?: string
  defaultBranch?: string
  latestScanId?: string
  trend?: number[]
}

// ── more engine view types ──────────────────────────────────────

export interface BundledFile {
  path: string
  kind: string // script | markdown | binary | resource
  hasNetworkEgress?: boolean
  readsSecrets?: boolean
  hasHardcodedSecret?: boolean
}

export interface Skill {
  name: string
  description: string
  allowedTools: string[]
  externalURLs: string[]
  bundledFiles: BundledFile[]
  filePath: string
  startLine: number
  endLine: number
}

export type InventoryKind = 'tool' | 'agent' | 'subagent' | 'skill' | 'mcp'

export interface InventoryEntity {
  kind: InventoryKind
  name: string
  filePath: string
  startLine: number
  endLine: number
  detail?: string
}

// ── platform view types used by shared components ───────────────

export interface RepoSummary {
  id: string
  name: string
  score: number // 0..1
  gate: GateState
  findings: number
  lastScan: string
  trend: number[]
  scanRoute?: string // link target when this repo has a loaded scan
}

export type IntegrationStatus = 'connected' | 'disconnected' | 'error'

export interface Integration {
  id: string
  name: string
  kind: string
  status: IntegrationStatus
  detail: string
}
