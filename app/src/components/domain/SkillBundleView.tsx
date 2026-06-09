import type { ReactNode } from 'react'
import type { Skill } from '@/types'
import { Badge } from '@/components/ui/Badge'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-xs uppercase tracking-wide text-fg-subtle">{title}</div>
      {children}
    </div>
  )
}

/** A skill's SKILL.md facts + bundled-file inventory with the per-file risk flags. */
export function SkillBundleView({ skill }: { skill: Skill }) {
  return (
    <div className="space-y-4">
      <div>
        <div className="font-mono text-xs text-fg-muted">{skill.filePath}</div>
        <h3 className="mt-1 text-base font-semibold">{skill.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-fg-muted">{skill.description}</p>
      </div>

      <Section title="Allowed tools">
        <div className="flex flex-wrap gap-1.5">
          {skill.allowedTools.length > 0 ? (
            skill.allowedTools.map((t) => <Badge key={t}>{t}</Badge>)
          ) : (
            <span className="text-sm text-fg-subtle">none declared</span>
          )}
        </div>
      </Section>

      {skill.externalURLs.length > 0 && (
        <Section title="External URLs">
          <ul className="space-y-1 font-mono text-xs text-fg-muted">
            {skill.externalURLs.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </Section>
      )}

      <Section title={`Bundled files · ${skill.bundledFiles.length}`}>
        <ul className="space-y-1.5">
          {skill.bundledFiles.map((b) => (
            <li key={b.path} className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate font-mono text-xs text-fg-muted">{b.path}</span>
              <span className="flex shrink-0 gap-1.5">
                <Badge>{b.kind}</Badge>
                {b.hasNetworkEgress && <Badge tone="warning">network</Badge>}
                {b.readsSecrets && <Badge tone="warning">secrets</Badge>}
                {b.hasHardcodedSecret && <Badge tone="danger">hardcoded secret</Badge>}
              </span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}
