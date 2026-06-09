import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'neutral' | 'brand' | 'warning' | 'success' | 'danger'

const TONE: Record<Tone, string> = {
  neutral: 'border-strong text-fg-muted',
  brand: 'border-strong text-brand-emphasis',
  warning: 'border-strong text-status-warning',
  success: 'border-strong text-status-success',
  danger: 'border-strong text-status-danger',
}

export function Badge({
  tone = 'neutral',
  className,
  children,
}: {
  tone?: Tone
  className?: string
  children: ReactNode
}) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-[3px] text-xs', TONE[tone], className)}>
      {children}
    </span>
  )
}
