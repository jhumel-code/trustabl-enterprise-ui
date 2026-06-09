# Trustabl Enterprise — UI Generation Model & Structure

> 🔗 **Live demo:** https://jhumel-code.github.io/trustabl-enterprise-ui/ — the
> [`app/`](app/) React frontend, rendering a real `trustabl scan`.

A structured, machine-consumable model that **drives generation** of wireframes, page
layouts, the design system, and integration surfaces for the Trustabl Enterprise
control plane. Feed these artifacts to a generator (an LLM, a codegen step, a Figma
plugin, or a human designer) to produce screens consistently.

This is the *substrate*, not the screens. The unit of generation is a **page spec**;
everything else is shared context the generator pulls from.

## The model — four composable layers

```
            ┌──────────────────────────────────────────────┐
  generate  │  page-spec (YAML)   ← the unit of generation  │
  a screen  │     ├─ layout: <template>   (layout grammar)  │
   from →    │     ├─ regions: [components] (component lib)  │
            │     ├─ data: {bindings}     (data model)      │
            │     └─ states / actions                       │
            └──────────────────────────────────────────────┘
                    ▲            ▲            ▲
              design-tokens  component lib  data-model
              (visual lang)  (what renders) (what it binds)
```

A screen = **page-spec** × **layout template** × **components** × **tokens**, bound to
**data-model** entities. Change a token → every screen restyles. Change a component →
every page using it updates. Add a page → write one page-spec.

## Files

| File | Layer | Form |
|---|---|---|
| `design-tokens.json` | Visual language (color, type, space, motion) | JSON (→ Tailwind / CSS vars / Figma) |
| `design-system.md` | Token rationale + **component taxonomy** + **layout grammar** | Markdown |
| `information-architecture.md` | Personas, navigation, route map, **page inventory** | Markdown |
| `data-model.md` | **Entities the UI binds to** (grounded in engine `ScanResult`) + integration model | Markdown |
| `page-spec.schema.json` | **The page DSL** — how a screen is described for generation | JSON Schema |
| `examples/scan-overview.page.yaml` | Example page spec (flagship scan overview) | YAML (DSL instance) |
| `examples/wireframe-scan-overview.html` | A rendered wireframe — proof the pipeline works | HTML (uses the tokens) |
| `examples/wireframe-scan-overview.png` | Rendered snapshot of that wireframe | PNG |
| `assets/` | Official Trustabl brand marks (shield logo, white variant, favicon, UI mark) — bundled locally, no CDN | PNG |

## Generation pipeline

1. Pick/author a **page-spec** (validates against `page-spec.schema.json`).
2. Resolve its `layout` to a **layout template** and its components to the **component library**.
3. Bind `data:` references to **data-model** entities (shape known from the engine).
4. Render with **design-tokens** → wireframe (lo-fi), layout (mid-fi), or coded screen (hi-fi).

The same page-spec drives all three fidelities; only the renderer changes.

## Trustabl-specific principles (these constrain every screen)

1. **Determinism is visible.** Every scan view surfaces `ScanID`, resolved rules
   version (commit SHA / bundle digest — never a semver), cache/offline state, and
   the `RulesOrigin` watermark that flags unsigned / custom / pre-release rule packs.
   The trust wedge shows up in the UI, not just the docs.
2. **Air-gap-first.** No external CDN, web-font, analytics, or telemetry calls. Tokens,
   fonts, and icons bundle locally. There is **no usage-metering UI** (license-key model).
3. **Severity-first IA.** Findings, surfaces, and readiness scores are the spine; everything
   else (inventory, coverage, provenance) hangs off them.
4. **Dark-mode first** (security-tooling convention), light parity via semantic tokens.
5. **Overlay, never mutate.** Triage, waivers, and policy are presented as overlays on a
   byte-stable scan — the UI never implies the underlying result changed.
6. **Single-tenant per deployment** (self-hosted). No tenant-switcher chrome in v1; org
   switching is a managed-tier-only concern.

_Last reviewed: 2026-06-09._
