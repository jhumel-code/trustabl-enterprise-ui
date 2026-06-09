import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/cn'

export type ToastTone = 'success' | 'error' | 'warning' | 'info'

export interface ToastOptions {
  title: string
  description?: string
  tone?: ToastTone
  /** Auto-dismiss delay in ms; pass 0 to keep until dismissed. Default 4500. */
  duration?: number
}

interface ToastRecord extends Required<Omit<ToastOptions, 'description'>> {
  id: number
  description?: string
}

const ToastContext = createContext<((opts: ToastOptions) => void) | null>(null)

/** Push a dismissable toast. Must be used within <ToastProvider>. */
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

const TONE_DOT: Record<ToastTone, string> = {
  success: 'bg-status-success',
  error: 'bg-status-danger',
  warning: 'bg-status-warning',
  info: 'bg-status-info',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([])
  const idRef = useRef(0)
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({})

  const dismiss = useCallback((id: number) => {
    setToasts((ts) => ts.filter((t) => t.id !== id))
    const tm = timers.current[id]
    if (tm) {
      clearTimeout(tm)
      delete timers.current[id]
    }
  }, [])

  const toast = useCallback(
    (opts: ToastOptions) => {
      const id = (idRef.current += 1)
      const record: ToastRecord = {
        id,
        title: opts.title,
        description: opts.description,
        tone: opts.tone ?? 'info',
        duration: opts.duration ?? 4500,
      }
      setToasts((ts) => [...ts, record])
      if (record.duration > 0) {
        timers.current[id] = setTimeout(() => dismiss(id), record.duration)
      }
    },
    [dismiss],
  )

  // Clear any pending timers on teardown.
  useEffect(() => {
    const pending = timers.current
    return () => Object.values(pending).forEach(clearTimeout)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[500] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 rounded-lg border border-strong bg-surface-raised p-3 shadow-lg"
          >
            <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', TONE_DOT[t.tone])} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-fg">{t.title}</div>
              {t.description && <div className="mt-0.5 text-xs text-fg-muted">{t.description}</div>}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="-m-1 shrink-0 rounded p-1 text-fg-subtle hover:bg-inset hover:text-fg"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
