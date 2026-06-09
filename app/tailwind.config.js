/**
 * Generated from ../design-tokens.json. Semantic colors resolve to CSS custom
 * properties (see src/styles/tokens.css) so a single [data-theme] swap restyles
 * the whole app. Never hard-code hex in a component — use these tokens.
 * @type {import('tailwindcss').Config}
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-canvas)',
        surface: { DEFAULT: 'var(--bg-surface)', raised: 'var(--bg-surface-raised)' },
        inset: 'var(--bg-inset)',
        fg: {
          DEFAULT: 'var(--fg-default)',
          muted: 'var(--fg-muted)',
          subtle: 'var(--fg-subtle)',
          onbrand: 'var(--fg-onbrand)',
        },
        brand: { DEFAULT: 'var(--brand)', emphasis: 'var(--brand-emphasis)' },
        severity: {
          critical: 'var(--sev-critical)',
          high: 'var(--sev-high)',
          medium: 'var(--sev-medium)',
          low: 'var(--sev-low)',
          info: 'var(--sev-info)',
        },
        status: {
          success: 'var(--status-success)',
          warning: 'var(--status-warning)',
          danger: 'var(--status-danger)',
          info: 'var(--status-info)',
          neutral: 'var(--status-neutral)',
        },
        coverage: { yes: 'var(--cov-yes)', partial: 'var(--cov-partial)', no: 'var(--cov-no)' },
      },
      borderColor: {
        DEFAULT: 'var(--border-default)',
        strong: 'var(--border-strong)',
      },
      ringColor: { brand: 'var(--focus-ring)' },
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono Variable', 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        xs: '12px',
        sm: '13px',
        base: '14px',
        md: '16px',
        lg: '18px',
        xl: '22px',
        '2xl': '28px',
        '3xl': '34px',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.20)',
        md: '0 4px 12px rgba(0,0,0,0.28)',
        lg: '0 12px 32px rgba(0,0,0,0.40)',
      },
      maxWidth: { content: '1440px' },
    },
  },
  plugins: [],
}
