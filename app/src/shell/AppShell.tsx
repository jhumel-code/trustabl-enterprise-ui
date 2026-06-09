import { Outlet } from 'react-router-dom'
import { Topbar } from './Topbar'
import { Sidebar } from './Sidebar'

/** The global frame: topbar (56px) spanning both columns, a 248px sidebar, and
 *  the scrollable main region that page-specs fill. */
export function AppShell() {
  return (
    <div
      className="grid h-screen"
      style={{ gridTemplateColumns: '248px 1fr', gridTemplateRows: '56px 1fr' }}
    >
      <Topbar />
      <Sidebar />
      <main className="overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
