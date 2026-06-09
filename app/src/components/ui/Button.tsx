import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

const VARIANT: Record<Variant, string> = {
  primary: 'bg-brand text-fg-onbrand border border-brand font-semibold hover:bg-brand-emphasis',
  secondary: 'border border-strong text-fg hover:bg-inset',
  ghost: 'border border-transparent text-fg-muted hover:text-fg hover:bg-inset',
  danger: 'bg-status-danger text-white border border-transparent',
}

const SIZE: Record<Size, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  type = 'button',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md transition-colors disabled:opacity-50',
        SIZE[size],
        VARIANT[variant],
        className,
      )}
      {...rest}
    />
  )
}
