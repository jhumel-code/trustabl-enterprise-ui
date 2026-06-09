# Design System — tokens, components, layout grammar

The vocabulary a generator draws from. Tokens style components; components fill layout
regions; layouts are referenced by name from a page-spec.

## 1. Foundations (from `design-tokens.json`)

- **Theme:** dark-first; light parity via semantic tokens. Never hard-code hex in a
  component — bind to `color.semantic.*` / `color.severity.*`.
- **Type:** Inter (UI) + JetBrains Mono (code, file:line, ScanID, rule IDs). Bundled, no CDN.
- **Density:** data-dense default (`space.2`/`space.3` rhythm, 32–36px table rows). Security
  reviewers scan tables; favor information density over whitespace.
- **Iconography:** one bundled line-icon set (lucide-style), 16/20px, `currentColor`.
- **Brand mark:** the official Trustabl shield (teal `color.semantic.brand`), bundled
  locally in `assets/` — `logo.png` (HD master), `logo_white.png` (for teal/light
  backgrounds), `logo_favicon.png` (48px), and `logo-mark.png` (the 24–32px UI mark
  generated from the master). Topbar lockup = shield + "Trustabl" wordmark in
  `fg.default`. No external/CDN logo fetch (air-gap).
- **Motion:** `fast` for hovers, `base` for drawers/modals; respect `prefers-reduced-motion`.
- **A11y:** WCAG 2.2 AA contrast (the dark severity tokens are tuned for it), visible
  `focus.ring` on every interactive node, full keyboard nav for tables/menus, ARIA on
  async regions.

## 2. Component library

### Primitives (generic, themeable)
`Button` · `IconButton` · `Input` · `Select` · `Combobox` · `Checkbox` · `Radio` ·
`Switch` · `Textarea` · `Badge` · `Tag` · `Avatar` · `Tooltip` · `Card` · `Panel` ·
`Table` · `DataGrid` (sort/filter/virtualize) · `Tabs` · `Accordion` · `Dialog` ·
`Drawer` · `Popover` · `Menu` · `Toast` · `Breadcrumbs` · `Pagination` · `Skeleton` ·
`Spinner` · `ProgressBar` · `Callout` · `CodeBlock` · `KeyValue` · `Stat` · `SearchBar` ·
`FilterPanel` · `EmptyState` · `ErrorState`.

Each defines: **variants**, **sizes** (`sm|md`), **states** (default/hover/active/
focus/disabled/loading), and token bindings. Example contract:

> **Button** — variants `primary|secondary|ghost|danger`; size `sm|md`; states incl.
> `loading`. `primary` = `bg color.semantic.brand`, `fg color.semantic.fg.onBrand`,
> `radius.md`, `focus.ring`.

### Domain components (Trustabl — the product's identity)
These bind across the two domains in `data-model.md`. The **Domain** column says which:
`engine` = read-only, deterministic `ScanResult` fields; `platform` = the mutable
control-plane overlay. A generator must never render a `platform` component as engine
output. (Binding paths are camelCase → engine snake_case `json:` tags.)

| Component | Domain | Purpose | Binds |
|---|---|---|---|
| `SeverityBadge` | engine | critical/high/medium/low/info pill | `Finding.severity` → `color.severity.*` |
| `ScopeBadge` | engine | tool / agent / subagent / skill / repo — plus a neutral `meta` state for `Finding.scope == ""` (META findings) | `Finding.scope` |
| `ConfidenceMeter` | engine | 0–1 confidence | `Finding.confidence` |
| `ScoreGauge` | engine | `0..1` readiness ring (may DISPLAY as %, but the bound value is `0..1`) | `Scan.overallScore` |
| `ProjectedScoreLadder` | engine | FixCritical→FixAll headroom (each `0..1`; engine estimate — never recompute) | `Scan.projectedScores` |
| `FindingRow` / `FindingCard` | engine | one finding (title, sev, scope, `file:startLine–endLine`, confidence) | `Finding` |
| `FindingDetailPanel` | engine + platform | explanation · suggested fix · **rule provenance** · waive (waive is platform) | `Finding` + `RulePack` |
| `FindingTable` | engine | group-by severity/category/scope, virtualized, faceted | `Finding[]` |
| `CapabilityMatrix` | engine | heatmap grid; a UI-derived projection over `ToolDef` facts (touches-FS / shells-out / HTTP), Kind, typed-params — not an engine "capability" set | tools × `ToolDef` facts |
| `SurfaceCard` / `SurfaceList` | engine | per-surface readiness (tool / agent / subagent / skill / repo) | `Surface[]` |
| `InventoryTree` | engine | tools · agents · subagents · skills · MCP servers · slash-commands · plugins · settings | inventory slices |
| `SkillBundleView` | engine | a skill's `SKILL.md` + `bundledFiles[]` (path, kind, hasNetworkEgress, readsSecrets, hasHardcodedSecret) + content findings | `Skill` |
| `CoveragePanel` | engine | files parsed vs skipped (incomplete-scan honesty) | `Scan.coverage` |
| `ScanProvenanceBar` | engine | **ScanID + rules source/version (SHA or bundle digest) + `RulesOrigin` signed/unsigned/custom badge + `Watermark()` banner (not-blessed scans only) + stale / schema-newer / skipped-count + offline/from-cache badge** | `Scan` (8 rules-provenance fields) |
| `RuleProvenanceCard` | engine + editorial | rule id, pack id/category, severity/confidence; OWASP LLM Top 10 anchor + rulebook link are editorial overlay (separate rulebook repo, not engine output) | `RulePack` |
| `GateStatus` | platform | pass/fail derived from the `--strict` severity threshold + which finding tripped it | `Gate` |
| `WaiverChip` / `WaiverDialog` | platform | suppress-with-approval + expiry | `Waiver` |
| `PolicyEditor` | platform | rule selection, severity thresholds, gate config | `Policy` |
| `RepoCard` | platform + engine | repo + latest score + trend + last scan | `Repo` + `Scan` |
| `ScanTimeline` / `ScanDiff` | engine | history; compare two `ScanID`s | `Scan[]` |
| `TrendChart` | platform | score / findings over time (platform-assembled series) | `Repo.trend` |
| `DependencyBOMTable` / `VulnBadge` | engine | repo-wide dependency BOM + (opt-in `--vuln-scan`) vulnerabilities | `Dependency[]` + `Vulnerability[]` |
| `IntegrationCard` | platform | connect/status for an integration | `Integration` |

### State components
`EmptyState` variants: `clean-scan` (0 findings — celebrate, don't alarm), `no-repos`,
`no-findings-at-filter`, `unaudited-sdk` (the honest "we don't audit X" signal). Plus
`ErrorState`, `ForbiddenState`, `LoadingSkeleton`.

## 3. Layout grammar

Every authenticated page renders inside **`app-shell`** (the outer frame). A page-spec's
`layout` describes the structure of the shell's `main` region. Each template exposes
**named regions** that a page-spec fills.

| Template | Regions | Use for |
|---|---|---|
| `app-shell` | `topbar`, `sidebar`, `breadcrumb`, `header`, `main`, `aside?`, `footer?` | global frame, implicit on every authenticated page — **not** a selectable page-spec `layout` |
| `dashboard-grid` | `header`, `grid`, `aside?` | overview/home, repo dashboard |
| `list-detail` | `list`, `detail` | findings browser, repos list, audit log |
| `split` | `left`, `right` | scan diff/compare |
| `settings-form` | `nav`, `form`, `aside?` | policy, integrations, org settings |
| `wizard` | `steps`, `body`, `footer` | onboard repo, connect integration, first-run |
| `full-bleed` | `main` | agent/skill graph, large matrix |
| `auth` | `panel` | login / SSO redirect (no shell) |
| `empty` | `body` | standalone empty/first-run |

**Responsive:** `sidebar` collapses to icons < `lg`; `aside` becomes a `Drawer` < `lg`;
tables switch to stacked cards < `md`. `contentMax` 1440px, centered.

**App-shell anatomy:**
- `topbar` (56px): logo, global `SearchBar` (repos/findings/rules), env/offline badge,
  theme toggle, user menu. **No tenant switcher** (single-tenant), **no usage meter**.
- `sidebar` (248px): primary nav (see `information-architecture.md`).
- `header`: page title, `breadcrumbs`, page `actions`.
- `aside` (320px right rail): contextual filters/help/provenance.

## 4. How a generator uses this

1. Read the page-spec `layout` → load that template's regions.
2. For each node in a region, resolve the component name here → its variant/props contract.
3. Resolve `{bindings}` to `data-model` entity fields.
4. Apply `design-tokens` for the chosen theme/fidelity.
5. Emit the non-happy `states` too (loading/empty/error/forbidden).
