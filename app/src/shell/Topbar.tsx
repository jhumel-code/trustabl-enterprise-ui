import { Menu } from 'lucide-react'
import { UserMenu } from './UserMenu'
import { GlobalSearch } from './GlobalSearch'
import { NotificationMenu } from './NotificationMenu'
import { TopNav } from './TopNav'

/** Global top bar with inline primary navigation. Below `lg` the nav collapses,
 *  so a hamburger button (wired to `onMenu`) opens it as a slide-over; the search
 *  field collapses on the narrowest screens to keep the controls from wrapping. */
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
          <Menu size={20} />
        </button>
      )}
      <span className="flex items-center gap-2 whitespace-nowrap font-bold tracking-tight">
        <img src={`${import.meta.env.BASE_URL}brand/logo-mark.png`} alt="" className="block h-6 w-6" /> Trustabl
      </span>
      <TopNav />
      <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-3">
        <GlobalSearch />
        <NotificationMenu />
        <UserMenu />
      </div>
    </header>
  )
}
