import type { RulesOrigin, Severity } from '@/types'

/** Render a 0..1 engine score as a whole percentage. The engine domain is
 *  always [0,1]; only the display is a percentage. */
export const pct = (v: number): string => `${Math.round(v * 100)}%`

/** file:startLine–endLine, collapsing single-line entities; file-only for
 *  repo-scope findings (both lines 0). Mirrors the engine line-range model. */
export function locationLabel(f: { filePath: string; startLine: number; endLine: number }): string {
  if (!f.startLine) return f.filePath
  if (f.endLine && f.endLine !== f.startLine) return `${f.filePath}:${f.startLine}–${f.endLine}`
  return `${f.filePath}:${f.startLine}`
}

/** Mirrors engine RulesOrigin.Tag(): the stable origin label. */
export function originLabel(o: RulesOrigin): string {
  if (o.signed) return `signed · ${o.channel ?? 'unknown'}`
  if (o.custom) return 'unsigned · custom'
  return 'unsigned · default'
}

/** Mirrors engine RulesOrigin.Watermark(): a banner for a not-blessed scan, or
 *  null for a clean/trusted one. */
export function rulesWatermark(o: RulesOrigin): string | null {
  if (o.signed && o.channel && o.channel !== 'production') {
    return `Rules channel: ${o.channel} — pre-release rules, not blessed for production.`
  }
  if (!o.signed && o.custom) {
    return 'UNSIGNED rules from a custom source — these rules were not signature-verified.'
  }
  return null
}

/** True when the origin badge should read as a warning (not blessed production). */
export function originIsWarning(o: RulesOrigin): boolean {
  if (o.signed) return o.channel !== 'production'
  return true // any unsigned scan
}

export const SEVERITY_ORDER: Severity[] = ['critical', 'high', 'medium', 'low', 'info']

/** A distinct dot/background color per discovered entity kind / finding scope. */
export function kindDot(kind: string): string {
  switch (kind) {
    case 'tool':
      return 'bg-status-info'
    case 'agent':
      return 'bg-brand'
    case 'subagent':
      return 'bg-status-danger'
    case 'skill':
      return 'bg-status-warning'
    case 'mcp':
      return 'bg-status-success'
    case 'repo':
      return 'bg-status-neutral'
    default:
      return 'bg-fg-subtle'
  }
}

/** Short display of a commit SHA / long ref; leaves human refs untouched. */
export const shortRef = (s: string): string => (/^[0-9a-f]{12,}$/i.test(s) ? s.slice(0, 7) : s)

/** Truncate a long id for display with an ellipsis. */
export const truncId = (s: string, n = 16): string => (s.length > n ? s.slice(0, n) + '…' : s)

/** A readable label for a rules source URL (github.com/owner/repo → owner/repo). */
export const sourceLabel = (url: string): string =>
  url.replace(/^https?:\/\//, '').replace(/^github\.com\//, '').replace(/\.git$/, '')
