import type { Severity } from '@/types'
import { cn } from '@/lib/cn'

const STYLE: Record<Severity, string> = {
  critical: 'bg-severity-critical text-white',
  high: 'bg-severity-high text-white',
  medium: 'bg-severity-medium text-slate-900',
  low: 'bg-severity-low text-white',
  info: 'bg-severity-info text-white',
}

const LABEL: Record<Severity, string> = {
  critical: 'CRIT',
  high: 'HIGH',
  medium: 'MED',
  low: 'LOW',
  info: 'INFO',
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={cn('inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold', STYLE[severity])}>
      {LABEL[severity]}
    </span>
  )
}
