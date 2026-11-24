import type {InputHTMLAttributes, ReactNode, SelectHTMLAttributes} from 'react'
import {cx} from '@/shared/lib/cx'

const control =
    'block w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ' +
    'focus:outline-none focus:ring-2 focus:ring-slate-900/10'

const controlState = (invalid?: boolean) =>
    invalid ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-slate-500'

interface FieldProps {
    label: string
    htmlFor: string
    error?: string
    children: ReactNode
}

export function Field({label, htmlFor, error, children}: FieldProps) {
    return (
        <div>
            <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-slate-700">
                {label}
            </label>
            {children}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    invalid?: boolean
}

export function Input({invalid, className, ...props}: InputProps) {
    return <input className={cx(control, controlState(invalid), className)} {...props} />
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    invalid?: boolean
    placeholder?: string
    options: { value: string | number; label: string }[]
}

export function Select({invalid, placeholder = 'Select…', options, className, ...props}: SelectProps) {
    return (
        <select className={cx(control, controlState(invalid), className)} {...props}>
            <option value="">{placeholder}</option>
            {options.map((o) => (
                <option key={o.value} value={o.value}>
                    {o.label}
                </option>
            ))}
        </select>
    )
}
