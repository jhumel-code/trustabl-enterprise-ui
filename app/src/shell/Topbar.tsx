import { ThemeToggle } from './ThemeToggle'
import { ConnectivityBadge } from './ConnectivityBadge'
import { UserMenu } from './UserMenu'

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
        readOnly
        title="Search coming soon"
        className="max-w-[520px] flex-1 cursor-not-allowed rounded-md border border-strong bg-inset px-2.5 py-1.5 text-sm text-fg-muted"
        placeholder="Search repos · findings · rules…"
      />
      <ConnectivityBadge />
      <ThemeToggle />
      <UserMenu />
    </header>
  )
}
