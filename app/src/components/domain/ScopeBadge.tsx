import type { Scope } from '@/types'

/** Renders Finding.scope; an empty scope (META findings) shows as "meta". */
export function ScopeBadge({ scope }: { scope: Scope }) {
  return <span className="text-sm text-fg-muted">{scope === '' ? 'meta' : scope}</span>
}
