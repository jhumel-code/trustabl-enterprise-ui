import { cn } from '@/lib/cn'

type Tone = 'success' | 'warning' | 'danger' | 'neutral' | 'subtle'

const TONE: Record<Tone, string> = {
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  danger: 'bg-status-danger',
  neutral: 'bg-status-neutral',
  subtle: 'bg-fg-subtle',
}

/** The single status-dot used across integration status, connectivity, etc. */
export function StatusDot({ tone, className }: { tone: Tone; className?: string }) {
  return <span className={cn('inline-block h-2 w-2 rounded-full', TONE[tone], className)} />
}
