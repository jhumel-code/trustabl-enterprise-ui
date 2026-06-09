import { NavLink } from 'react-router-dom'
import { NAV } from './nav'
import { cn } from '@/lib/cn'
import { NavGroupMenu } from './NavGroupMenu'

/** Horizontal primary navigation (desktop only), rendered inline in the top bar.
 *  Ungrouped items render as tabs; headed groups (Governance, Settings) collapse
 *  into dropdown menus so the whole IA fits on one row. Below `lg` this is hidden
 *  and the hamburger drawer takes over — a horizontal bar can't hold the full nav
 *  on a narrow screen. */
export function TopNav() {
  return (
    <nav className="hidden shrink-0 items-center gap-1 lg:flex">
      {NAV.map((group, gi) =>
        group.heading ? (
          <NavGroupMenu key={gi} group={group} />
        ) : (
          group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-1.5 text-sm hover:text-fg',
                  isActive ? 'bg-inset font-medium text-fg' : 'text-fg-muted',
                )
              }
            >
              {item.label}
            </NavLink>
          ))
        ),
      )}
    </nav>
  )
}
