import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'

/** Global top bar. Below `lg` the sidebar is hidden, so a hamburger button
 *  (wired to `onMenu`) opens it as a slide-over; the search field collapses on
 *  the narrowest screens to keep the controls from wrapping. */
export function Topbar({ onMenu }: { onMenu?: () => void } = {}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-surface px-4">
      {onMenu && (
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open navigation"
          className="-ml-1 rounded-md p-1.5 text-fg-muted hover:bg-inset hover:text-fg lg:hidden"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}
      <span className="flex items-center gap-2 whitespace-nowrap font-bold tracking-tight">
        <img src={`${import.meta.env.BASE_URL}brand/logo-mark.png`} alt="" className="block h-6 w-6" /> Trustabl
      </span>
      <input
        readOnly
        title="Search coming soon"
        className="hidden max-w-[520px] flex-1 cursor-not-allowed rounded-md border border-strong bg-inset px-2.5 py-1.5 text-sm text-fg-muted sm:block"
        placeholder="Search repos · findings · rules…"
      />
      <div className="flex-1 sm:hidden" />
      <ThemeToggle />
      <UserMenu />
    </header>
  )
}
