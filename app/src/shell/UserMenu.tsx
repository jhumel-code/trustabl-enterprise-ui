import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { members } from '@/data/platform'
import { cn } from '@/lib/cn'
import { NAV } from './nav'

// Settings nav lives in this menu (flagged inUserMenu) rather than the top bar.
const settingsItems = NAV.filter((g) => g.inUserMenu).flatMap((g) => g.items)

// Signed-in user (mock — first member of the org).
const user = members[0]
const initials = user.name
  .split(' ')
  .map((s) => s[0])
  .join('')
  .slice(0, 2)
  .toUpperCase()

function MenuItem({
  children,
  onClick,
  danger,
}: {
  children: ReactNode
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        'block w-full px-3 py-1.5 text-left text-sm hover:bg-inset',
        danger ? 'text-status-danger' : 'text-fg',
      )}
    >
      {children}
    </button>
  )
}

export function UserMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

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

  const go = (to: string) => {
    setOpen(false)
    navigate(to)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={user.name}
        className="grid h-7 w-7 place-items-center rounded-full border border-strong text-xs text-fg-muted hover:border-brand hover:text-fg"
      >
        {initials}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-[400] mt-2 w-56 overflow-hidden rounded-lg border bg-surface shadow-lg"
        >
          <div className="border-b px-3 py-2.5">
            <div className="text-sm font-medium text-fg">{user.name}</div>
            <div className="font-mono text-xs text-fg-muted">{user.email}</div>
            <div className="mt-1 text-xs text-fg-subtle">{user.role}</div>
          </div>
          <div className="py-1">
            <div className="px-3 py-1 text-[11px] uppercase tracking-wider text-fg-subtle">
              Settings
            </div>
            {settingsItems.map((item) => (
              <MenuItem key={item.to} onClick={() => go(item.to)}>
                {item.label}
              </MenuItem>
            ))}
          </div>
          <div className="border-t py-1">
            <MenuItem danger onClick={() => go('/login')}>
              Sign out
            </MenuItem>
          </div>
        </div>
      )}
    </div>
  )
}
