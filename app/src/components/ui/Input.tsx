import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-md border border-strong bg-inset px-3 py-2 text-sm text-fg placeholder:text-fg-subtle disabled:opacity-60',
        className,
      )}
      {...rest}
    />
  )
}
