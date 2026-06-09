import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'neutral' | 'brand' | 'warning' | 'success' | 'danger'
type Variant = 'outline' | 'solid'

const OUTLINE: Record<Tone, string> = {
  neutral: 'border-strong text-fg-muted',
  brand: 'border-strong text-brand-emphasis',
  warning: 'border-strong text-status-warning',
  success: 'border-strong text-status-success',
  danger: 'border-strong text-status-danger',
}

const SOLID: Record<Tone, string> = {
  neutral: 'border-transparent bg-status-neutral text-white',
  brand: 'border-transparent bg-brand text-fg-onbrand',
  warning: 'border-transparent bg-status-warning text-white',
  success: 'border-transparent bg-status-success text-white',
  danger: 'border-transparent bg-severity-critical text-white',
}

export function Badge({
  tone = 'neutral',
  variant = 'outline',
  className,
  children,
}: {
  tone?: Tone
  variant?: Variant
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-[3px] text-xs font-medium',
        variant === 'solid' ? SOLID[tone] : OUTLINE[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
