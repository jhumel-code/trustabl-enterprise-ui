# Information Architecture

## Personas (drive nav + page `persona` tags)

| Persona | Slug | Primary jobs | Lands on |
|---|---|---|---|
| **Security lead** (primary) | `security-lead` | org posture, triage, policy, compliance | Overview → Findings → Policy |
| **Developer** | `developer` | my repo's findings + fixes, unblock the PR gate | Repo → Scan → Finding |
| **Compliance / auditor** | `compliance` | standards coverage, evidence, audit trail | Compliance, Audit log |
| **Platform admin** | `platform-admin` | integrations, members/RBAC, license, air-gap updates | Settings |
| **Exec** (read-only) | `exec` | trend, top risks | Overview |

The `Slug` is the canonical persona id — the closed set used by `page-spec.schema.json`'s
`persona` enum and the page table below. `all` is shorthand for "shown to every persona".

## Navigation (sidebar groups)

```
Overview
Repositories
Findings
Surfaces & Inventory
─ Governance ─
  Policy
  Waivers
  Compliance
─ Settings (admin) ─
  Integrations
  Rule packs
  Members & roles
  Audit log
  Organization
  License
```

Topbar: global search (repos · findings · rules), **offline/air-gap badge**, theme
toggle, user menu. No tenant switcher, no usage meter (single-tenant, license-key).

## Route map

```
/login                                              auth
/onboarding                                         wizard (first-run)
/                                                   Overview (org posture)
/repos                                              Repositories
/repos/:repoId                                      Repo overview
/repos/:repoId/scans/:scanId                        Scan overview            ← flagship
/repos/:repoId/scans/:scanId/diff/:otherScanId      Scan diff
/findings                                           Findings (cross-repo)
/findings/:findingId                                Finding detail (panel)
/surfaces/:surfaceId                                Surface detail
/skills/:skillId                                    Skill detail (SKILL.md + bundle + deps)
/inventory                                          Inventory graph
/policy                                             Policy editor
/waivers                                            Waivers
/compliance                                         Compliance mapping & reports
/settings/integrations                              Integrations
/settings/rules                                     Rule packs
/settings/members                                   Members & roles
/settings/audit                                     Audit log
/settings/organization                              Org settings + air-gap updates
/settings/license                                   License & entitlements
```

## Page inventory

Each page is a `page-spec` (see `page-spec.schema.json`). `layout` = content layout
inside the implicit `app-shell`. Engine-domain bindings are read-only; gate / policy /
waiver / RBAC / SSO surfaces are **platform-domain** overlays (see `data-model.md`).

| Page | Route | Layout | Key components | Persona |
|---|---|---|---|---|
| **Overview** | `/` | dashboard-grid | ScoreGauge(org), RepoCard[], TrendChart, FindingTable(top), IntegrationCard[] | security-lead, exec |
| **Repositories** | `/repos` | list-detail | RepoCard[] / DataGrid (score, trend, lastScan, gate¹) | security-lead, developer |
| **Repo overview** | `/repos/:id` | dashboard-grid | ScoreGauge, ProjectedScoreLadder, ScanTimeline, SurfaceList, TrendChart | developer, security-lead |
| **Scan overview** ⭐ | `…/scans/:scanId` | dashboard-grid | **ScanProvenanceBar**, ScoreGauge, severity Stat[], Tabs(Findings/Surfaces/Inventory/Coverage), FilterPanel, GateStatus¹ | all |
| **Scan diff** | `…/diff/:other` | split | ScanDiff, severity delta, GateStatus¹ delta | security-lead, developer |
| **Findings** | `/findings` | list-detail | FilterPanel(facets), FindingTable(group-by), FindingDetailPanel | security-lead, developer |
| **Finding detail** | `/findings/:id` | (panel) | FindingDetailPanel: explanation · suggested fix (file `startLine–endLine`; scope may be META) · RuleProvenanceCard · WaiverDialog¹ | developer |
| **Surface detail** | `/surfaces/:id` | list-detail | SurfaceCard, its FindingTable, ConfidenceMeter (`:surfaceId` = the `kind·filePath·name` triple) | developer |
| **Skill detail** | `/skills/:id` | list-detail | SkillBundleView (SKILL.md + bundledFiles risk flags), content FindingTable, repo-wide DependencyBOMTable, VulnBadge (only with `--vuln-scan`) | security-lead |
| **Inventory** | `/inventory` | full-bleed | InventoryTree / agent-skill graph, CapabilityMatrix | security-lead |
| **Policy** | `/policy` | settings-form | PolicyEditor¹ (rule selection, severity thresholds, gate rules) | security-lead |
| **Waivers** | `/waivers` | list-detail | Waiver¹ table, WaiverDialog (approve/expire), filter by status | security-lead |
| **Compliance** | `/compliance` | dashboard-grid | standards coverage (OWASP LLM Top 10:2025 — editorial mapping from the rulebook; not engine-emitted), export report | compliance |
| **Integrations** | `/settings/integrations` | settings-form | IntegrationCard[]¹ (connect/status), config forms | platform-admin |
| **Rule packs** | `/settings/rules` | list-detail | RulePack table + RulesOrigin provenance (signed channel / unsigned-default / unsigned-custom), version (SHA or bundle digest), rulebook links², update | security-lead, platform-admin |
| **Members & roles** | `/settings/members` | settings-form | user table, role matrix (RBAC)¹, team assignment, SSO/SCIM status | platform-admin |
| **Audit log** | `/settings/audit` | list-detail | AuditEvent¹ table, filter (actor/action/target/time), export | compliance, platform-admin |
| **Organization** | `/settings/organization` | settings-form | general, **air-gap update** (rules pin = SHA/digest; vulndb pin = OSV content hash³), data retention | platform-admin |
| **License** | `/settings/license` | settings-form | entitlements, caps (repos/agents), tier, **offline key upload** | platform-admin |
| **Onboarding** | `/onboarding` | wizard | connect SCM → discover repos → first scan → invite team | platform-admin |
| **Login** | `/login` | auth | SSO (SAML/OIDC) button, fallback local | all |

¹ **Platform-domain.** The engine `Finding` is read-only — it has no `status`/`waiver`/
`assignee`. Gate, Policy, Waiver, Integration, RBAC and audit are control-plane overlays;
`GateStatus` is pass/fail derived from the `--strict` exit-code threshold (highest finding
severity vs the threshold), **not** an engine-tunable per-rule gate.
² Rulebook links are a UI-constructed convention (a deterministic URL from category/topic),
not engine data — they may 404. Signed channels are not yet live (empty keyring,
fail-closed), so the live default is an **unsigned** git clone.
³ The vulndb pin (`vulndb.Resolved.Version`, an OSV 16-hex content hash) is **not emitted
in scan output today** (only folded into `ScanID`); surfacing it needs an engine change.

## Primary flows

- **Triage:** Overview → Repo → Scan overview → Finding detail → *waive / assign / fix*.
- **PR gate:** SCM PR check → Scan overview → GateStatus → fix or request waiver (approval).
- **Onboard:** Login → Onboarding wizard → connect SCM → add repos → first scan.
- **Compliance:** Compliance → filter by OWASP LLM Top 10:2025 → export evidence (editorial mapping from the rulebook, not engine-emitted).
- **Air-gap update:** Settings › Organization → pull rules + vulndb snapshot (offline mirror) → rules SHA / bundle-digest + vulndb content-hash pinned.
- **Skill investigation** (ties to the skill scanner): Findings(filter scope=skill) → Skill detail → bundled-file content finding → repo-wide dependency BOM / vuln (opt-in `--vuln-scan`).
