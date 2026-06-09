import { ThemeToggle } from './ThemeToggle'
import { ConnectivityBadge } from './ConnectivityBadge'

export function Topbar() {
  return (
    <header
      className="flex items-center gap-4 border-b bg-surface px-4"
      style={{ gridColumn: '1 / 3' }}
    >
      <span className="flex items-center gap-2 font-bold tracking-tight">
        <img src={`${import.meta.env.BASE_URL}brand/logo-mark.png`} alt="" className="block h-6 w-6" /> Trustabl
      </span>
      <input
        className="max-w-[520px] flex-1 rounded-md border border-strong bg-inset px-2.5 py-1.5 text-sm text-fg-muted"
        placeholder="Search repos · findings · rules…"
      />
      <ConnectivityBadge />
      <ThemeToggle />
      <span className="grid h-7 w-7 place-items-center rounded-full border border-strong text-xs text-fg-muted">
        IB
      </span>
    </header>
  )
}
