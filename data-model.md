# Data Model — what the UI binds to

Two ownership domains, and one architectural rule that keeps the trust wedge intact.

## The rule: engine entities are immutable; lifecycle is an overlay

- **Engine domain (read-only, deterministic):** produced by `scanner.Run`, immutable per
  `ScanID`. The UI never edits these. `Scan`, `Finding`, `Surface`, inventory (`Tool`,
  `Agent`, `Subagent`, `Skill`, `MCPServer`), `Dependency`, `RulePack`, `VulnDB`.
  `ScanResult` also serializes `HostedTools`, `SlashCommands`, `PluginManifests`,
  `ClaudeSettings`, `Vulnerabilities`, and a `has_shell_invocations` flag — bindable but
  omitted from this list. (`Guardrails`, `Sessions`, `ClaudeAgentOptions`,
  `UsesDefaultTracing` live only on `RepoInventory` and never reach the scan JSON.)
- **Platform domain (mutable):** owned by the control plane. `Org`, `User`, `Team`, `Role`,
  `Repo`, `Policy`, `Gate`, `Waiver`, `Integration`, `AuditEvent`, `Notification`.
- **Lifecycle is an overlay, never a mutation.** A finding's `status` (open / waived /
  fixed) and any `waiver` are stored separately, keyed by a stable **finding identity**
  = `(ruleId, scope, filePath, startLine, endLine, toolName, title)`, and joined onto the immutable
  finding **at read time**. So the byte-stable scan is never altered — the UI shows
  "waived", the underlying `ScanResult` is untouched. This is the determinism wedge made
  visible: anyone can re-run the engine and reproduce the raw result.

## Engine entities (mirror of `ScanResult` — bind to the snake_case `json:` tags)

```
Scan {                         # = ScanResult, keyed by ScanID
  id (ScanID)                  # folds inputs + rulesVersion + rulesOrigin (+ vulnDb hash if --vuln-scan)
  repo                         # label string (json:"repo") — NOT an id; engine carries no repoId / timestamp
  overallScore: 0..1           # float64 in [0,1], never 0..100
  projectedScores { fixCritical, fixHigh, fixMedium, fixLow, fixAll }   # each 0..1; engine ESTIMATE — never recompute
  languages[], sdks[]
  # ── Rules provenance: the trust wedge → ScanProvenanceBar ──
  rulesSource, rulesVersion, rulesFromCache
  rulesStale?, rulesSchemaVersion?, rulesSchemaNewer?, rulesSkipped[]?
  rulesOrigin { signed, channel?, custom? }    # drives the Watermark() banner (see note below)
  vulnerabilities[]?           # []DepVuln, only under --vuln-scan (omitempty; absent on the default path)
  coverage { filesParsed, filesSkipped, skippedFiles[] }   # → CoveragePanel
}
Finding {                      # = models.Finding + overlay fields
  ruleId, category, scope (tool|agent|subagent|skill|repo, or "" for META findings)
  severity (critical|high|medium|low|info), confidence 0..1
  toolName, filePath, startLine, endLine, title, explanation, suggestedFix
  # location is an inclusive 1-indexed RANGE (json start_line / end_line):
  #   single-line entity → endLine == startLine; repo-scope finding → both 0
  # overlay (platform, joined at read time): status, waiverId, assignee, firstSeenScanId
}
Surface { kind (tool|agent|subagent|skill|repo), name, filePath, score: 0..1,
          findingCount, weightedSeverity }                               # SurfaceReadiness
Tool|Agent|Subagent|Skill|MCPServer { name, filePath, startLine, endLine, ... }   # inventory slices
Skill {                        # skill scanner surface (SkillDef)
  name, description, allowedTools[], dynamicExecCommands[], externalURLs[], injectionMarkers[]
  bundledFiles[] { path, kind (script|markdown|binary|resource),
                   hasNetworkEgress, readsSecrets, hasHardcodedSecret }
  # SkillDef also carries toolGrants, disallowedTools, disableModelInvocation (omitted here).
  # Dependencies are NOT per-skill — they live in the repo-wide BOM (Dependency) below.
}
Dependency { name, version, ecosystem, source, startLine, endLine }      # DepRef — repo-wide declared BOM
             # version = declared spec verbatim (pin | range | empty), NOT a resolved/locked version
Vulnerability { dep, id, aliases[], summary, severity, fixedIn }         # DepVuln — only under --vuln-scan
             # id = primary OSV id (GHSA-/PYSEC-/CVE-); aliases include the CVE; matched for pinned deps only
RulePack { id, name, category, version }     # version = commit SHA (git) or bundle digest (signed) — never semver
           # Provenance is RulesOrigin on the Scan (signed channel | unsigned | custom), NOT a free/premium tier.
           # RuleDef carries NO references/cwe/owasp field — standards mapping is editorial (rulebook repo),
           # anchored on OWASP LLM Top 10:2025. rulebookUrl is UI-constructed from category/topic (not engine data).
VulnDB { version, fromCache, ecosystems[] }  # NOT EMITTED in scan JSON today — lives in vulndb.Resolved, folded into
           # ScanID only; must be added to ScanResult before the UI can bind it.
           # version = OSV snapshot 16-hex content hash (never a SHA / semver).
```

**Provenance & scores (read before binding).** `rulesOrigin` drives the report
watermark: `RulesOrigin.Watermark()` is **non-empty only for a not-blessed scan**
(unsigned-from-a-custom-source, or a signed but pre-production channel); a
signed-production scan and the plain unsigned-default scan render no banner. Signed
channels are not yet live (empty keyring, fail-closed), so the **live default is
unsigned-default**. All engine scores (`overallScore`, `surface.score`,
`projectedScores.*`) are `float64` in `[0,1]` — display as a percentage, but never
bind a `0..100` value. `gateStatus` is **platform-derived** from the `--strict`
exit-code threshold (see the `Gate` platform entity), not a `ScanResult` field.

## Platform entities

```
Org      { id, name, settings, licenseId }
User     { id, email, displayName, roleId, teamIds[], ssoSubject }
Team     { id, name, repoIds[] }
Role     { id, name, permissions[] }     # RBAC (non-exhaustive): findings:read, policy:write,
                                          # waiver:approve, scan:run, settings:admin, audit:read …
Repo     { id, name, scm, url, defaultBranch, teamId, latestScanId, trend[] }
Policy   { id, ruleSelection[], severityThresholds{}, gates[] }   # which rules, gate rules
Gate     { status (pass|fail), trippedBy (ruleId|threshold) }     # derived per scan
Waiver   { id, findingIdentity, reason, approvedBy, createdAt, expiresAt,
           status (active|expired|revoked) }                      # overlay; approval + expiry
Integration { type, status, config, scopes[] }
AuditEvent  { id, actor, action, target, at, meta }               # immutable, append-only
License  { tier, entitlements[], caps { repos, agents }, offlineKey, expiresAt }
```

## Binding contract (how a page-spec `data:` resolves)

- `{ entity: Scan, by: route.scanId }` → one `Scan`.
- `{ entity: Finding[], where: { scanId: route.scanId } }` → findings **with overlay joined**.
- `{ entity: Surface[], where: { scanId: route.scanId } }`.
- Curly bindings in props read fields: `{scan.overallScore}`, `{scan.rulesVersion}`,
  `{finding.suggestedFix}`. Collections support `groupBy` / facet filters in the component.
- **Case mapping.** Binding paths are camelCase view-model names that map 1:1 onto the
  engine's snake_case `json:` tags (`overallScore` → `overall_score`, `startLine` →
  `start_line`, `rulesOrigin` → `rules_origin`, `suggestedFix` → `suggested_fix`).

## Integration model

Each integration is one `Integration` record + a config page + UI surfaces it feeds.

| Integration | Auth | Triggers / data flow | UI surfaces |
|---|---|---|---|
| **SCM** — GitHub / GitLab / Bitbucket | App install or OAuth; PAT for self-hosted | webhook on push/PR → scan → **PR check + SARIF**; repo discovery | Onboarding, Repos, Scan (gate), Integrations |
| **SSO / IdP** — SAML / OIDC | metadata exchange; **SCIM** provisioning | login, user/team sync | Login, Members |
| **Jira** | OAuth / API token | "create issue from finding", bi-link | Finding detail, Integrations |
| **Slack / Teams** | webhook / app | notify on gate-fail / new critical / waiver-expiry | Integrations, Notifications |
| **SIEM / webhook** | signed webhook (HMAC) | stream findings + audit events out | Integrations, Audit |
| **Ticketing / ITSM** | API token | export findings as tickets | Finding detail |

**Air-gap note:** every integration must degrade to **offline / on-prem endpoints**
(self-hosted GitLab, internal IdP, internal webhook). No integration may hard-require a
public SaaS endpoint, or it breaks the air-gapped deployment.
