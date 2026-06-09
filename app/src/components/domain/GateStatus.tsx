import type { Gate } from '@/types'
import { cn } from '@/lib/cn'

/** Platform-derived gate verdict (from the --strict exit-code threshold). */
export function GateStatus({ gate }: { gate: Gate }) {
  const pass = gate.status === 'pass'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white',
        pass ? 'bg-status-success' : 'bg-severity-critical',
      )}
    >
      {pass ? '✓ Gate passed' : `✗ Gate failed${gate.trippedBy ? ` — ${gate.trippedBy}` : ''}`}
    </span>
  )
}
