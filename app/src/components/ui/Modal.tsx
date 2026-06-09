import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

const WIDTH = {
  sm: 'max-w-[360px]',
  md: 'max-w-[480px]',
  lg: 'max-w-[640px]',
}

/** Centered modal dialog. Closes on overlay click or Escape. Renders nothing
 *  when closed. Sits above the Drawer (z-300 vs z-200). */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: keyof typeof WIDTH
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[300] grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn('relative w-full overflow-hidden rounded-xl border bg-surface shadow-lg', WIDTH[size])}
      >
        {title && (
          <div className="flex items-center justify-between border-b px-5 py-3">
            <div className="text-sm font-semibold">{title}</div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-2 py-1 text-fg-muted hover:bg-inset hover:text-fg"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t px-5 py-3">{footer}</div>}
      </div>
    </div>
  )
}
