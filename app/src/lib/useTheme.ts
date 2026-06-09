import { useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

function initialTheme(): Theme {
  try {
    const stored = localStorage.getItem('trustabl-theme')
    if (stored === 'dark' || stored === 'light') return stored
  } catch {
    /* localStorage unavailable */
  }
  return 'dark'
}

/** Theme state bound to the document `data-theme` attribute and localStorage.
 *  Returns the current theme and a setter; mount it once in an always-present
 *  component (the user menu lives in the header on every app page). */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('trustabl-theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  return [theme, setTheme] as const
}
