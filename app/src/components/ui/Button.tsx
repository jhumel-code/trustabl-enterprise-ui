import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

const VARIANT: Record<Variant, string> = {
  primary: 'bg-brand text-fg-onbrand border border-brand font-semibold hover:bg-brand-emphasis',
  secondary: 'border border-strong text-fg hover:bg-inset',
  ghost: 'border border-transparent text-fg-muted hover:text-fg hover:bg-inset',
  danger: 'bg-status-danger text-white border border-transparent',
}

export function Button({
  variant = 'secondary',
  className,
  type = 'button',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors disabled:opacity-50',
        VARIANT[variant],
        className,
      )}
      {...rest}
    />
  )
}
