import { pct } from '@/lib/format'

/** 0..1 readiness ring (engine domain). Displays as a percentage; the bound
 *  value stays 0..1. */
export function ScoreGauge({ value, size = 84 }: { value: number; size?: number }) {
  const deg = Math.round(value * 360)
  const inner = Math.round(size * 0.76)
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(var(--brand) 0 ${deg}deg, var(--bg-surface-raised) ${deg}deg 360deg)`,
      }}
    >
      <div className="grid place-items-center rounded-full bg-surface" style={{ width: inner, height: inner }}>
        <span className="font-bold" style={{ fontSize: Math.round(size * 0.24) }}>
          {pct(value)}
        </span>
      </div>
    </div>
  )
}
