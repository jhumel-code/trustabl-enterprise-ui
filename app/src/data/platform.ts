import type { Integration, RepoSummary } from '@/types'
import { findings, gate, scan } from './loadScan'

// Mock control-plane (platform-domain) data. The engine never produces these —
// they live in the control plane. Swap for a real API client later.

const realScanRoute = `/repos/email-agent/scans/${scan.id}`

export const repos: RepoSummary[] = [
  {
    id: 'email-agent',
    name: 'email-agent',
    score: scan.overallScore,
    gate: gate.status,
    findings: findings.length,
    lastScan: '2026-06-09',
    trend: [0.61, 0.63, 0.66, 0.7, 0.75, scan.overallScore],
    scanRoute: realScanRoute,
  },
  { id: 'payments-service', name: 'payments-service', score: 0.92, gate: 'pass', findings: 3, lastScan: '2026-06-09', trend: [0.8, 0.82, 0.85, 0.88, 0.9, 0.92] },
  { id: 'support-copilot', name: 'support-copilot', score: 0.54, gate: 'fail', findings: 14, lastScan: '2026-06-08', trend: [0.7, 0.66, 0.6, 0.58, 0.55, 0.54] },
  { id: 'data-pipeline-agent', name: 'data-pipeline-agent', score: 0.81, gate: 'pass', findings: 5, lastScan: '2026-06-07', trend: [0.74, 0.76, 0.78, 0.79, 0.8, 0.81] },
]

export const integrations: Integration[] = [
  { id: 'github', name: 'GitHub', kind: 'SCM', status: 'connected', detail: '4 repos · PR check + SARIF active' },
  { id: 'sso', name: 'Okta (OIDC)', kind: 'SSO / IdP', status: 'connected', detail: 'SCIM provisioning on' },
  { id: 'jira', name: 'Jira', kind: 'Ticketing', status: 'connected', detail: 'create issue from finding' },
  { id: 'slack', name: 'Slack', kind: 'Notifications', status: 'disconnected', detail: 'notify on gate-fail / new critical' },
  { id: 'siem', name: 'Splunk (HEC)', kind: 'SIEM / webhook', status: 'error', detail: 'HMAC signature mismatch' },
]

export const waivers = [
  { id: 'wv_31', ruleId: 'CSDK-012', title: 'TypeScript Claude SDK tool writes to the filesystem', reason: 'Sandboxed temp dir only; reviewed by platform team.', approvedBy: 'r.santos', createdAt: '2026-05-28', expiresAt: '2026-07-28', status: 'active' as const },
  { id: 'wv_28', ruleId: 'CSKILL-020', title: 'Skill fetches untrusted external content', reason: 'Vendored mirror, not live fetch.', approvedBy: 'a.dlcruz', createdAt: '2026-04-10', expiresAt: '2026-06-01', status: 'expired' as const },
  { id: 'wv_22', ruleId: 'OAI-005', title: 'Network call has no timeout', reason: 'Superseded by upstream fix.', approvedBy: 'r.santos', createdAt: '2026-03-15', expiresAt: '2026-09-15', status: 'revoked' as const },
]

export const auditEvents = [
  { id: 'ev_1042', at: '2026-06-09 09:14', actor: 'r.santos', action: 'waiver.approve', target: 'CSDK-012 · email-agent' },
  { id: 'ev_1041', at: '2026-06-09 08:55', actor: 'system', action: 'scan.complete', target: 'email-agent · scan_fdcdb91c' },
  { id: 'ev_1039', at: '2026-06-08 17:30', actor: 'a.dlcruz', action: 'policy.update', target: 'severity threshold → medium' },
  { id: 'ev_1037', at: '2026-06-08 16:02', actor: 'i.bautista', action: 'integration.connect', target: 'Jira' },
  { id: 'ev_1031', at: '2026-06-07 11:20', actor: 'system', action: 'rules.update', target: 'd77749c5' },
]

export const members = [
  { id: 'u1', name: 'Ian Bautista', email: 'ian.bautista@trustabl.ai', role: 'Admin', sso: true },
  { id: 'u2', name: 'Rafael Santos', email: 'r.santos@trustabl.ai', role: 'Security lead', sso: true },
  { id: 'u3', name: 'Ana dela Cruz', email: 'a.dlcruz@trustabl.ai', role: 'Compliance', sso: true },
  { id: 'u4', name: 'Dev Bot', email: 'ci@trustabl.ai', role: 'Developer', sso: false },
]

export const roles = [
  { id: 'admin', name: 'Admin', permissions: ['findings:read', 'policy:write', 'waiver:approve', 'settings:admin', 'audit:read'] },
  { id: 'seclead', name: 'Security lead', permissions: ['findings:read', 'policy:write', 'waiver:approve'] },
  { id: 'compliance', name: 'Compliance', permissions: ['findings:read', 'audit:read'] },
  { id: 'dev', name: 'Developer', permissions: ['findings:read', 'scan:run'] },
]

export const rulePacks = [
  { id: 'claude_sdk', name: 'Claude Agent SDK', category: 'claude_sdk', version: 'd77749c5', source: 'trustabl-rules', rules: 41 },
  { id: 'claude_skill', name: 'Claude Skills', category: 'claude_skill', version: 'd77749c5', source: 'trustabl-rules', rules: 18 },
  { id: 'openai_sdk', name: 'OpenAI Agents SDK', category: 'openai_sdk', version: 'd77749c5', source: 'trustabl-rules', rules: 33 },
  { id: 'mcp', name: 'Model Context Protocol', category: 'mcp', version: 'd77749c5', source: 'trustabl-rules', rules: 22 },
]

export const policy = {
  failThreshold: 'medium',
  strict: false,
  selectedPacks: ['claude_sdk', 'claude_skill', 'openai_sdk', 'mcp'],
  gates: [
    { id: 'g1', label: 'Block PR on any finding ≥ threshold', on: true },
    { id: 'g2', label: 'Require waiver approval for high+ findings', on: true },
    { id: 'g3', label: 'Fail on unsigned rule packs', on: false },
  ],
}

export const license = {
  tier: 'Enterprise',
  seats: 25,
  seatsUsed: 4,
  reposCap: 50,
  reposUsed: 4,
  agentsCap: 200,
  agentsUsed: 11,
  expiresAt: '2027-01-31',
  offlineKey: true,
  entitlements: ['Unlimited scans', 'Air-gap updates', 'SSO/SCIM', 'Signed rule channels', 'SARIF + SIEM export'],
}

export const org = {
  name: 'Trustabl Inc.',
  deployment: 'Self-hosted (single-tenant)',
  rulesPinned: 'd77749c5 (git)',
  vulndbPinned: 'not pulled',
  retentionDays: 365,
}

// OWASP LLM Top 10:2025 — editorial mapping from the rulebook (not engine-emitted).
export const compliance = [
  { id: 'LLM01', name: 'Prompt Injection', covered: 6, total: 8, findings: 2 },
  { id: 'LLM02', name: 'Sensitive Information Disclosure', covered: 5, total: 7, findings: 1 },
  { id: 'LLM03', name: 'Supply Chain', covered: 4, total: 6, findings: 0 },
  { id: 'LLM04', name: 'Data and Model Poisoning', covered: 2, total: 5, findings: 0 },
  { id: 'LLM05', name: 'Improper Output Handling', covered: 4, total: 6, findings: 1 },
  { id: 'LLM06', name: 'Excessive Agency', covered: 7, total: 9, findings: 4 },
  { id: 'LLM07', name: 'System Prompt Leakage', covered: 3, total: 4, findings: 0 },
  { id: 'LLM08', name: 'Vector and Embedding Weaknesses', covered: 1, total: 4, findings: 0 },
  { id: 'LLM09', name: 'Misinformation', covered: 2, total: 4, findings: 0 },
  { id: 'LLM10', name: 'Unbounded Consumption', covered: 3, total: 5, findings: 0 },
]
