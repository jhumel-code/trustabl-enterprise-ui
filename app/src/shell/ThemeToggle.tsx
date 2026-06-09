import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

function initialTheme(): Theme {
  try {
    const stored = localStorage.getItem('trustabl-theme')
    if (stored === 'dark' || stored === 'light') return stored
  } catch {
    /* localStorage unavailable */
  }
  return 'dark'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('trustabl-theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  return (
    <button
      type="button"
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      className="rounded-full border border-strong px-2 py-[3px] text-xs text-fg-muted hover:text-fg"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '◐ dark' : '◑ light'}
    </button>
  )
}
