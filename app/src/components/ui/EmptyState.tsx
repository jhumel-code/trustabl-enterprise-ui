import type { ReactNode } from 'react'

/** Standard empty / no-selection placeholder. */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="rounded-lg border bg-surface p-8 text-center">
      <div className="text-sm font-medium text-fg">{title}</div>
      {description && <div className="mt-1 text-xs text-fg-subtle">{description}</div>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}
