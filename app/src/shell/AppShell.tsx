import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Topbar } from './Topbar'
import { Sidebar } from './Sidebar'

/** Global frame, top-nav layout: a single 56px top bar holding the brand, inline
 *  primary navigation, search, and controls, with the main region spanning the
 *  full width below — no sidebar eating horizontal space. Below `lg` the inline
 *  nav collapses and the hamburger opens it as a slide-over drawer (the sidebar
 *  component, reused for the narrow-screen case). */
export function AppShell() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col">
      <Topbar onMenu={() => setNavOpen(true)} />

      {/* Narrow-screen nav — slide-over drawer below lg. */}
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
  )
}
