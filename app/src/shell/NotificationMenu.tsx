import { useEffect, useRef, useState } from 'react'
import { Bell, X } from 'lucide-react'
import { notifications as seed, type AppNotification } from '@/data/platform'
import { cn } from '@/lib/cn'

const TONE_DOT: Record<AppNotification['tone'], string> = {
  success: 'bg-status-success',
  danger: 'bg-status-danger',
  warning: 'bg-status-warning',
  info: 'bg-status-info',
}

/** Header notification center: a bell with an unread badge that opens a feed.
 *  Items can be marked read (click) or dismissed (×); read/dismiss state is
 *  client-only (no control-plane backend wired). */
export function NotificationMenu() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<AppNotification[]>(seed)
  const ref = useRef<HTMLDivElement>(null)
  const unread = items.filter((n) => !n.read).length

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

  const markRead = (id: string) =>
    setItems((xs) => xs.map((n) => (n.id === id ? { ...n, read: true } : n)))
  const markAllRead = () => setItems((xs) => xs.map((n) => ({ ...n, read: true })))
  const dismiss = (id: string) => setItems((xs) => xs.filter((n) => n.id !== id))

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ''}`}
        className="relative rounded-md p-1.5 text-fg-muted hover:bg-inset hover:text-fg"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-status-danger px-1 text-[10px] font-semibold leading-none text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-[400] mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border bg-surface shadow-lg"
        >
          <div className="flex items-center justify-between border-b px-3 py-2.5">
            <span className="text-sm font-semibold text-fg">Notifications</span>
            {unread > 0 && (
              <button type="button" onClick={markAllRead} className="text-xs text-brand-emphasis hover:underline">
                Mark all read
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-fg-muted">You're all caught up.</div>
          ) : (
            <ul className="max-h-96 divide-y overflow-auto">
              {items.map((n) => (
                <li key={n.id}>
                  <div
                    className={cn('flex items-start gap-2.5 px-3 py-2.5', !n.read && 'bg-inset')}
                  >
                    <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', TONE_DOT[n.tone])} />
                    <button
                      type="button"
                      onClick={() => markRead(n.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className={cn('text-sm leading-snug', n.read ? 'text-fg-muted' : 'font-medium text-fg')}>
                        {n.title}
                      </div>
                      <div className="mt-0.5 text-xs text-fg-muted">{n.description}</div>
                      <div className="mt-0.5 text-[11px] text-fg-subtle">{n.time}</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => dismiss(n.id)}
                      aria-label="Dismiss notification"
                      className="-m-1 shrink-0 rounded p-1 text-fg-subtle hover:bg-inset hover:text-fg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
