import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Topbar } from './Topbar'
import { Sidebar } from './Sidebar'

/** The global frame: a 56px topbar, a 248px sidebar that is part of the layout
 *  from `lg` up and collapses to a hamburger-toggled slide-over below it, and a
 *  scrollable main region that page-specs fill. `min-w-0` on main lets wide
 *  tables scroll inside their cards instead of forcing the whole page wider. */
export function AppShell() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col">
      <Topbar onMenu={() => setNavOpen(true)} />

      <div className="flex min-h-0 flex-1">
        {/* Desktop sidebar — part of the layout from lg up. */}
        <div className="hidden w-[248px] shrink-0 lg:block">
          <Sidebar />
        </div>

        {/* Mobile sidebar — slide-over overlay below lg. */}
        {navOpen && (
          <div className="fixed inset-0 z-[250] lg:hidden">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setNavOpen(false)}
              className="absolute inset-0 bg-black/50"
            />
            <div className="absolute left-0 top-0 h-full w-[248px] shadow-xl">
              <Sidebar onNavigate={() => setNavOpen(false)} />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
