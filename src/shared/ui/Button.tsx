import type {ButtonHTMLAttributes} from 'react'
import {cx} from '@/shared/lib/cx'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md'

const variants: Record<Variant, string> = {
    primary: 'bg-slate-900 text-white hover:bg-slate-700',
    secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
    danger: 'bg-red-600 text-white hover:bg-red-500',
    ghost: 'text-slate-600 hover:bg-slate-100',
}

const sizes: Record<Size, string> = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant
    size?: Size
}

export function Button({variant = 'primary', size = 'md', type = 'button', className, ...props}: ButtonProps) {
    return (
        <button
            type={type}
            className={cx(
                'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors',
                'disabled:cursor-not-allowed disabled:opacity-50',
                variants[variant],
                sizes[size],
                className,
            )}
            {...props}
        />
    )
}
