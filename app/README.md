# Trustabl Enterprise — web app

The React frontend, generated from the design spec one level up (`../design-tokens.json`,
`../design-system.md`, `../information-architecture.md`, `../data-model.md`,
`../page-spec.schema.json`). This is the **hi-fi renderer** of that substrate.

## Stack

Vite · React 19 · TypeScript · Tailwind 3 · React Router 7. Fonts (Inter + JetBrains
Mono) are bundled locally via `@fontsource` — no CDN, per the air-gap principle.

## Run

```bash
npm install
npm run dev      # http://localhost:5173  (lands on the demo Scan overview)
npm run build    # tsc -b && vite build → dist/
npm run preview  # serve the production build
```

## How it maps to the spec

| Spec file | Where it lives in the app |
|---|---|
| `design-tokens.json` | `src/styles/tokens.css` (CSS vars, dark + light) + `tailwind.config.js` |
| `data-model.md` entities | `src/types.ts` (engine vs platform domains) |
| `design-system.md` components | `src/components/ui/` (primitives) + `src/components/domain/` |
| `information-architecture.md` | `src/shell/nav.ts` (sidebar) + `src/App.tsx` (routes) |
| `examples/scan-overview.page.yaml` | `src/pages/ScanOverview.tsx` (flagship) |
| **real engine output** | `src/data/scan.json` (a real `trustabl scan`) + `src/data/loadScan.ts` (adapter) |

Theming is a single `data-theme` swap on `<html>` — every semantic color is a CSS
variable, so changing a token restyles the whole app. Never hard-code a hex in a
component; use the Tailwind token classes (`bg-surface`, `text-fg-muted`,
`bg-severity-critical`, …).

## What's built vs stubbed

- **Built:** the app shell + design system, and **every page in the IA** —
  Overview, Repositories, Repo overview, Scan overview (the flagship, real data),
  Findings (list-detail + drawer), Surface detail, Skill detail, Inventory, Policy,
  Waivers, Compliance, Integrations, Rule packs, Members, Audit log, Organization,
  License, and Login (the only screen outside the shell).
- **Engine-data pages** (Overview, Repos, Scan, Findings, Surfaces, Skills, Inventory)
  read the real scan via `src/data/loadScan.ts`. **Platform pages** (Policy, Waivers,
  Members, Audit, Integrations, Org, License, plus the extra repos on Overview) read
  mock control-plane data from `src/data/platform.ts` — swap it for a real API.
- **Still stubbed:** Scan diff and Onboarding (`<StubPage>`).

`/` is the Overview dashboard. The flagship scan lives at
`/repos/email-agent/scans/<scanId>`.

## Refreshing the scan data

`src/data/scan.json` is a real engine run (`testdata/corpus/email-agent`). Regenerate it
from the engine repo:

```bash
trustabl scan <target> --no-rules-update --format json > app/src/data/scan.json
```

`src/data/loadScan.ts` adapts the engine's snake_case `ScanResult` to the `src/types.ts`
view-model. Engine entities are read-only; the platform overlay (`Finding.status`, `Gate`)
is synthesized there until a control-plane backend is wired (per `../data-model.md`).
