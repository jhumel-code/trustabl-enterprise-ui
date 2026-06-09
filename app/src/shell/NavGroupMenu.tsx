import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import type { NavGroup } from './nav'
import { cn } from '@/lib/cn'

/** A headed nav group (Governance, Settings) rendered as a top-bar dropdown.
 *  The trigger reads as active when the current route belongs to the group. */
export function NavGroupMenu({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const active = group.items.some((i) => pathname === i.to || pathname.startsWith(`${i.to}/`))

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Close when navigation changes the route.
  useEffect(() => setOpen(false), [pathname])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm hover:text-fg',
          active ? 'bg-inset font-medium text-fg' : 'text-fg-muted',
        )}
      >
        {group.heading}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn('transition-transform', open && 'rotate-180')}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-[300] mt-1 w-56 overflow-hidden rounded-lg border bg-surface py-1 shadow-lg"
        >
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'block px-3 py-1.5 text-sm hover:bg-inset',
                  isActive ? 'font-medium text-fg' : 'text-fg-muted',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}
