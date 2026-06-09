import type { Scope } from '@/types'
import { kindDot } from '@/lib/format'
import { cn } from '@/lib/cn'

/** Renders Finding.scope as a color-coded dot + label; empty scope shows as "meta". */
export function ScopeBadge({ scope }: { scope: Scope }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-fg-muted">
      <span className={cn('h-2 w-2 rounded-full', kindDot(scope))} />
      {scope === '' ? 'meta' : scope}
    </span>
  )
}
