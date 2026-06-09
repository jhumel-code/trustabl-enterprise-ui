import { NavLink } from 'react-router-dom'
import { NAV } from './nav'
import { cn } from '@/lib/cn'

export function Sidebar({ onNavigate }: { onNavigate?: () => void } = {}) {
  return (
    <nav className="h-full overflow-auto border-r bg-surface px-2 py-3">
      <ul className="text-sm">
        {NAV.filter((g) => !g.inUserMenu).map((group, gi) => (
          <li key={gi}>
            {group.heading && (
              <div className="mt-4 px-2.5 py-1 text-[11px] uppercase tracking-wider text-fg-subtle">
                {group.heading}
              </div>
            )}
            <ul>
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'block rounded-md px-2.5 py-[7px] text-fg-muted',
                        isActive
                          ? 'border-l-2 border-l-brand bg-surface-raised text-fg'
                          : 'hover:text-fg',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}
