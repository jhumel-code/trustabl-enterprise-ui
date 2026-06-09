import { useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface TabItem {
  id: string
  label: string
  count?: number
  content: ReactNode
}

export function Tabs({ items, initial }: { items: TabItem[]; initial?: string }) {
  const [active, setActive] = useState(initial ?? items[0]?.id)
  const current = items.find((i) => i.id === active) ?? items[0]
  return (
    <div>
      <div className="mb-3 flex gap-1 border-b">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            onClick={() => setActive(it.id)}
            className={cn(
              '-mb-px border-b-2 px-3 py-2 text-sm',
              it.id === current.id ? 'border-brand text-fg' : 'border-transparent text-fg-muted hover:text-fg',
            )}
          >
            {it.label}
            {typeof it.count === 'number' && <span className="text-fg-subtle"> · {it.count}</span>}
          </button>
        ))}
      </div>
      <div>{current.content}</div>
    </div>
  )
}
