import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full rounded-md border border-strong bg-inset px-3 py-2 text-sm text-fg disabled:opacity-60',
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  )
}
